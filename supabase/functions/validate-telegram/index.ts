
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValidateRequestBody {
  initData: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request body
    const { initData } = await req.json() as ValidateRequestBody;
    
    if (!initData) {
      console.error('Debug: Missing initData in request body');
      throw new Error('Missing initData in request body');
    }

    console.log('Debug: Starting Telegram validation for initData:', initData);

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      console.error('Debug: Bot token not configured');
      throw new Error('Bot token not configured');
    }

    // First validate the hash
    console.log('Debug: Validating Telegram hash...');
    const { data: hashValid, error: hashError } = await supabaseClient
      .rpc('validate_telegram_hash', {
        init_data: initData,
        bot_token: botToken
      });

    if (hashError) {
      console.error('Debug: Hash validation error:', hashError);
      throw hashError;
    }

    if (!hashValid) {
      console.log('Debug: Invalid hash in Telegram data');
      return new Response(
        JSON.stringify({ 
          isValid: false, 
          reason: 'Invalid hash - please access through Telegram' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // Then validate the auth date
    console.log('Debug: Validating Telegram auth date...');
    const { data: dateValid, error: dateError } = await supabaseClient
      .rpc('validate_telegram_date', {
        init_data: initData
      });

    if (dateError) {
      console.error('Debug: Date validation error:', dateError);
      throw dateError;
    }

    if (!dateValid) {
      console.log('Debug: Expired auth date in Telegram data');
      return new Response(
        JSON.stringify({ 
          isValid: false, 
          reason: 'Auth date expired - please refresh the game' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    console.log('Debug: Telegram validation successful');
    // Both validations passed
    return new Response(
      JSON.stringify({ isValid: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Debug: Error in validation:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        isValid: false,
        reason: 'Validation failed - please try again'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
