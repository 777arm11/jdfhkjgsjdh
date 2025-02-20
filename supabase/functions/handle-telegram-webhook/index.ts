
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramUpdate {
  message?: {
    text?: string;
    from?: {
      id: number;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
    chat?: {
      id: number;
    };
  };
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

    const update: TelegramUpdate = await req.json()
    console.log('Received Telegram update:', update)

    if (!update.message?.from) {
      throw new Error('Invalid update format')
    }

    const { from, text } = update.message
    
    // Handle /start command
    if (text?.startsWith('/start')) {
      const referralCode = text.split(' ')[1]?.replace('ref_', '')
      
      // Create or update user
      const { data: playerData, error: playerError } = await supabaseClient.rpc(
        'create_telegram_user',
        {
          p_telegram_id: from.id,
          p_username: from.username || '',
          p_first_name: from.first_name || '',
          p_last_name: from.last_name || ''
        }
      )

      if (playerError) {
        console.error('Error creating player:', playerError)
        throw playerError
      }

      // Process referral if exists
      if (referralCode && playerData) {
        const { error: referralError } = await supabaseClient.rpc(
          'process_referral_reward',
          {
            referral_code_param: referralCode,
            player_id_param: playerData
          }
        )

        if (referralError) {
          console.error('Error processing referral:', referralError)
        }
      }

      // Send welcome message
      const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
      if (!botToken) throw new Error('Bot token not configured')

      const welcomeMessage = referralCode 
        ? `Welcome! You've joined through a referral link. Get ready to play and earn rewards!`
        : `Welcome to the game! Start playing and earning rewards now!`

      const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: update.message.chat?.id,
          text: welcomeMessage,
          parse_mode: 'HTML'
        }),
      })

      if (!telegramResponse.ok) {
        const errorData = await telegramResponse.json()
        console.error('Telegram API error:', errorData)
        throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`)
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
