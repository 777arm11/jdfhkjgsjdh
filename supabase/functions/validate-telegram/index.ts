
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
      throw new Error('Missing initData in request body');
    }

    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      console.error('Bot token not configured');
      throw new Error('Bot token not configured');
    }

    // First validate the hash
    const { data: hashValid, error: hashError } = await supabaseClient
      .rpc('validate_telegram_init_data', {
        init_data: initData,
        bot_token: botToken
      });

    if (hashError) {
      console.error('Hash validation error:', hashError);
      throw hashError;
    }

    if (!hashValid) {
      console.error('Invalid hash in Telegram data');
      return new Response(
        JSON.stringify({ isValid: false, reason: 'Invalid hash' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // Then validate the auth date
    const { data: dateValid, error: dateError } = await supabaseClient
      .rpc('validate_telegram_init_data', {
        init_data: initData
      });

    if (dateError) {
      console.error('Date validation error:', dateError);
      throw dateError;
    }

    if (!dateValid) {
      console.error('Expired auth date in Telegram data');
      return new Response(
        JSON.stringify({ isValid: false, reason: 'Auth date expired' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // Both validations passed
    return new Response(
      JSON.stringify({ isValid: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
