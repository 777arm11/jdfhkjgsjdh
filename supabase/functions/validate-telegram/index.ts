
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
      console.error('Missing initData in request body');
      return new Response(
        JSON.stringify({ isValid: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Call the database validation function
    const { data, error } = await supabaseClient
      .rpc('validate_telegram_init_data', {
        init_data: initData,
        bot_token: Deno.env.get('TELEGRAM_BOT_TOKEN') ?? ''
      });

    if (error) {
      console.error('Validation error:', error);
      throw error;
    }

    console.log('Validation result:', data);

    return new Response(
      JSON.stringify({ isValid: data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message, isValid: false }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
