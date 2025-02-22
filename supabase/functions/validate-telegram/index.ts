
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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Debug: Starting validation process');
    
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Debug: Missing Supabase configuration');
      throw new Error('Server configuration error');
    }

    if (!botToken) {
      console.error('Debug: Missing bot token');
      throw new Error('Bot token not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const requestData = await req.json() as ValidateRequestBody;
    console.log('Debug: Received request data:', requestData);

    if (!requestData.initData) {
      console.error('Debug: Missing initData in request');
      throw new Error('Missing initData in request');
    }

    // Validate hash
    console.log('Debug: Validating hash...');
    const { data: hashValid, error: hashError } = await supabase.rpc(
      'validate_telegram_hash',
      {
        init_data: requestData.initData,
        bot_token: botToken
      }
    );

    if (hashError) {
      console.error('Debug: Hash validation error:', hashError);
      throw hashError;
    }

    if (!hashValid) {
      console.log('Debug: Invalid hash');
      return new Response(
        JSON.stringify({
          isValid: false,
          reason: 'Invalid hash - please access through Telegram'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Validate date
    console.log('Debug: Validating date...');
    const { data: dateValid, error: dateError } = await supabase.rpc(
      'validate_telegram_date',
      {
        init_data: requestData.initData
      }
    );

    if (dateError) {
      console.error('Debug: Date validation error:', dateError);
      throw dateError;
    }

    if (!dateValid) {
      console.log('Debug: Expired auth date');
      return new Response(
        JSON.stringify({
          isValid: false,
          reason: 'Auth date expired - please refresh the game'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    console.log('Debug: Validation successful');
    return new Response(
      JSON.stringify({ isValid: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Debug: Function error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        isValid: false,
        reason: 'Validation failed - please try again'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
