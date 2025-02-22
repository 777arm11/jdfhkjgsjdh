
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
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

// Helper function to send Telegram messages
async function sendTelegramMessage(chatId: number, text: string) {
  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!botToken) {
    throw new Error('Bot token not configured');
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Failed to send Telegram message:', errorData);
    throw new Error(`Failed to send Telegram message: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Process referral code from /start command
async function processReferralCode(referralCode: string, playerId: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Database configuration missing');
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data, error } = await supabaseAdmin.rpc('process_referral_reward', {
      referral_code_param: referralCode,
      player_id_param: playerId
    });

    if (error) {
      console.error('Error processing referral:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in processReferralCode:', error);
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Database configuration missing');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Handle /start command
    if (text?.startsWith('/start')) {
      console.log('Processing /start command');
      const referralCode = text.split(' ')[1]?.replace('ref_', '');
      
      // Create or update user
      const { data: playerData, error: playerError } = await supabaseAdmin.rpc(
        'create_telegram_user',
        {
          p_telegram_id: from.id,
          p_username: from.username || '',
          p_first_name: from.first_name || '',
          p_last_name: from.last_name || ''
        }
      );

      if (playerError) {
        console.error('Error creating player:', playerError);
        throw playerError;
      }

      // Process referral if exists
      let referralSuccess = false;
      if (referralCode && playerData) {
        referralSuccess = await processReferralCode(referralCode, playerData);
      }

      // Send welcome message
      const welcomeMessage = referralSuccess 
        ? `Welcome to Taparoo! 🎮\n\nYou've joined through a referral link and received your bonus coins! Start playing now and earn more rewards! 🎁\n\nType /help to see all available commands.`
        : `Welcome to Taparoo! 🎮\n\nGet ready to tap your way to the top! Start playing now and earn rewards! 🎯\n\nType /help to see all available commands.`;

      await sendTelegramMessage(chat.id, welcomeMessage);
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

