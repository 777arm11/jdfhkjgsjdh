
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValidateRequestBody {
  initData?: string;
  webAppData?: string;
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
    const { initData, webAppData } = await req.json() as ValidateRequestBody;
    
    // Handle WebApp validation
    if (webAppData) {
      try {
        const data = JSON.parse(webAppData);
        // Basic validation of required fields
        if (data.user_id && data.auth_date) {
          const timeDiff = Math.floor(Date.now() / 1000) - data.auth_date;
          // Allow 24 hours validity
          if (timeDiff < 86400) {
            return new Response(
              JSON.stringify({ isValid: true }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      } catch (e) {
        console.error('WebApp data parsing error:', e);
      }
    }

    // Handle regular Telegram validation
    if (initData) {
      const { data, error } = await supabaseClient
        .rpc('validate_telegram_init_data', {
          init_data: initData,
          bot_token: Deno.env.get('TELEGRAM_BOT_TOKEN') ?? ''
        });

      if (error) {
        console.error('Validation error:', error);
        throw error;
      }

      return new Response(
        JSON.stringify({ isValid: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ isValid: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message, isValid: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
