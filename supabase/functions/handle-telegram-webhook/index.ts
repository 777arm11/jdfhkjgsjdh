
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
      const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
      if (!botToken) throw new Error('Bot token not configured')

      // Create or update user in database
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

      // Prepare the keyboard with the game button
      const keyboard = {
        inline_keyboard: [[
          {
            text: "🎮 Play Game",
            web_app: {
              url: `https://ngqsbaihrhhwidrpzjgv.supabase.co/functions/v1/game-url?user_id=${from.id}`
            }
          }
        ]]
      };

      // Send welcome message with game button
      const welcomeMessage = `
Welcome to TapAroo! 🎮

Tap to earn coins and compete with players worldwide! Ready to start tapping?

• Earn coins by playing
• Compete on leaderboards
• Share with friends to earn more
      `.trim();

      const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: update.message.chat?.id,
          text: welcomeMessage,
          parse_mode: 'HTML',
          reply_markup: keyboard
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
