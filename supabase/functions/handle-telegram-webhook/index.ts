
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
    console.error('Bot token not configured');
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
      
      // Check for referral code
      const parts = text.split(' ');
      let referralMessage = '';
      
      if (parts.length > 1 && parts[1].startsWith('ref_')) {
        const referralCode = parts[1].substring(4); // Remove 'ref_' prefix
        console.log(`Referral code detected: ${referralCode}`);
        
        // Process referral if needed
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (supabaseUrl && supabaseServiceKey) {
          const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
          
          try {
            // Create Telegram user record if it doesn't exist
            await supabaseAdmin.rpc('create_telegram_user', {
              p_telegram_id: from.id,
              p_username: from.username || '',
              p_first_name: from.first_name || '',
              p_last_name: from.last_name || ''
            });
            
            // Get player ID for the current user
            const { data: playerData } = await supabaseAdmin
              .from('players')
              .select('id')
              .eq('telegram_id', from.id.toString())
              .maybeSingle();
              
            if (playerData?.id) {
              // Process the referral
              const { data: referralResult } = await supabaseAdmin.rpc(
                'process_referral_reward',
                {
                  referral_code_param: referralCode,
                  player_id_param: playerData.id
                }
              );
              
              if (referralResult > 0) {
                referralMessage = `\n\n🎁 You've earned ${referralResult} coins from using a referral code!`;
              }
            }
          } catch (err) {
            console.error('Error processing referral:', err);
          }
        }
      }

      // Get the game URL from environment variable
      const gameUrl = Deno.env.get('GAME_URL') || 'https://hope-coin-game.lovable.app/';
      
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
        `Click the button below to start playing! 🎯${referralMessage}`;

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
        .maybeSingle();

      if (playerError) {
        console.error('Error fetching player balance:', playerError);
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
      
      // Get the player data
      const { data: player, error: playerError } = await supabaseAdmin
        .from('players')
        .select('referral_code')
        .eq('telegram_id', from.id.toString())
        .maybeSingle();
        
      // If no referral code exists, generate one
      if (!player?.referral_code) {
        // Generate a new referral code
        const { data: referralCode } = await supabaseAdmin.rpc('generate_referral_code');
        
        // Update the player record with the new code
        await supabaseAdmin
          .from('players')
          .update({ referral_code: referralCode })
          .eq('telegram_id', from.id.toString());
          
        // Get the updated player data
        const { data: updatedPlayer } = await supabaseAdmin
          .from('players')
          .select('referral_code')
          .eq('telegram_id', from.id.toString())
          .maybeSingle();
          
        if (updatedPlayer?.referral_code) {
          // Get bot username for correct referral link
          const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
          const botInfoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
          const botInfo = await botInfoResponse.json();
          const botUsername = botInfo.result?.username || 'Hope_Coin_tapbot';
          
          const referralMessage = `🎁 Share your referral link and earn rewards!\n\n` +
            `Your referral link:\n` +
            `https://t.me/${botUsername}?start=ref_${updatedPlayer.referral_code}\n\n` +
            `Both you and your friend will receive 50 bonus coins when they join!`;
  
          await sendTelegramMessage(chat.id, referralMessage);
        } else {
          throw new Error('Failed to generate referral code');
        }
      } else {
        // Get bot username for correct referral link
        const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
        const botInfoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
        const botInfo = await botInfoResponse.json();
        const botUsername = botInfo.result?.username || 'Hope_Coin_tapbot';
        
        const referralMessage = `🎁 Share your referral link and earn rewards!\n\n` +
          `Your referral link:\n` +
          `https://t.me/${botUsername}?start=ref_${player.referral_code}\n\n` +
          `Both you and your friend will receive 50 bonus coins when they join!`;

        await sendTelegramMessage(chat.id, referralMessage);
      }
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
