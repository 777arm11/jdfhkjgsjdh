
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { initData } = await req.json()
    
    if (!initData) {
      console.error('No init data provided');
      return new Response(
        JSON.stringify({ isValid: false, reason: 'No init data provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Validate the hash
    const { data: validationResult, error: validationError } = await supabaseClient
      .rpc('validate_telegram_hash', {
        init_data: initData,
        bot_token: Deno.env.get('TELEGRAM_BOT_TOKEN') || ''
      })

    if (validationError || !validationResult) {
      console.error('Hash validation failed:', validationError);
      return new Response(
        JSON.stringify({ isValid: false, reason: 'Invalid hash' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate the date
    const { data: dateValid, error: dateError } = await supabaseClient
      .rpc('validate_telegram_date', {
        init_data: initData
      })

    if (dateError || !dateValid) {
      console.error('Date validation failed:', dateError);
      return new Response(
        JSON.stringify({ isValid: false, reason: 'Init data has expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse user data from init_data
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    let user: TelegramUser | null = null;
    
    if (userStr) {
      try {
        user = JSON.parse(decodeURIComponent(userStr));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // If we have valid user data, create/update the user
    if (user?.id) {
      const { error: userError } = await supabaseClient
        .rpc('create_telegram_user', {
          p_telegram_id: user.id,
          p_username: user.username || '',
          p_first_name: user.first_name || '',
          p_last_name: user.last_name || ''
        })

      if (userError) {
        console.error('Error creating/updating user:', userError);
      }
    }

    // Return success with user data
    return new Response(
      JSON.stringify({ 
        isValid: true,
        user: user,
        debug: { validationResult, dateValid }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in validate-telegram function:', error);
    return new Response(
      JSON.stringify({ 
        isValid: false, 
        reason: 'Internal server error',
        debug: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
