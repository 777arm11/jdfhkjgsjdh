import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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

// Helper function to send Telegram messages with inline keyboard support
async function sendTelegramMessage(chatId: number, text: string, inlineKeyboard?: any) {
  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!botToken) {
    throw new Error('Bot token not configured');
  }

  const messageData = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    reply_markup: inlineKeyboard
  };

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Failed to send Telegram message:', errorData);
    throw new Error(`Failed to send Telegram message: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Received webhook request');
    const update: TelegramUpdate = await req.json();
    console.log('Telegram update:', JSON.stringify(update, null, 2));

    if (!update.message?.from) {
      throw new Error('Invalid update format');
    }

    const { from, text, chat } = update.message;
    
    if (!chat?.id) {
      throw new Error('Chat ID missing from update');
    }

    // Handle /start command
    if (text?.startsWith('/start')) {
      console.log('Processing /start command');

      // Get the game URL from environment variable
      const gameUrl = Deno.env.get('GAME_URL') || 'https://your-game-url.com';
      
      // Create inline keyboard with game launch button
      const inlineKeyboard = {
        inline_keyboard: [[
          {
            text: "🎮 Play Taparoo",
            web_app: { url: gameUrl }
          }
        ]]
      };

      const welcomeMessage = `Welcome to Taparoo! 🎮\n\n` +
        `Get ready to tap your way to the top and compete with players worldwide! ` +
        `Click the button below to start playing! 🎯`;

      await sendTelegramMessage(chat.id, welcomeMessage, inlineKeyboard);
    } 
    // Handle /help command
    else if (text === '/help') {
      const helpMessage = `🎮 <b>Taparoo Commands</b>\n\n` +
        `/start - Start the game\n` +
        `/balance - Check your coin balance\n` +
        `/referral - Get your referral link\n` +
        `/help - Show this help message\n\n` +
        `🎯 Play the game to earn coins and climb the leaderboard!`;
      
      await sendTelegramMessage(chat.id, helpMessage);
    }
    // Handle /balance command
    else if (text === '/balance') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Database configuration missing');
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      const { data: player, error: playerError } = await supabaseAdmin
        .from('players')
        .select('coins')
        .eq('telegram_id', from.id.toString())
        .single();

      if (playerError) {
        throw new Error('Failed to fetch player balance');
      }

      const balanceMessage = `💰 Your current balance: ${player?.coins || 0} coins`;
      await sendTelegramMessage(chat.id, balanceMessage);
    }
    // Handle /referral command
    else if (text === '/referral') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Database configuration missing');
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      const { data: player, error: playerError } = await supabaseAdmin
        .from('players')
        .select('referral_code')
        .eq('telegram_id', from.id.toString())
        .single();

      if (playerError || !player?.referral_code) {
        throw new Error('Failed to fetch referral code');
      }

      const referralMessage = `🎁 Share your referral link and earn rewards!\n\n` +
        `Your referral link:\n` +
        `https://t.me/YourBotUsername?start=ref_${player.referral_code}\n\n` +
        `Both you and your friend will receive bonus coins when they join!`;

      await sendTelegramMessage(chat.id, referralMessage);
    }
    // Handle other messages
    else {
      const helpMessage = `I don't understand that command. Type /help to see available commands!`;
      await sendTelegramMessage(chat.id, helpMessage);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
