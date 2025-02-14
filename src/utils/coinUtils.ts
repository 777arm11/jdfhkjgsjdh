
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getBrowserId } from "./browserUtils";

export const handleCoinIncrement = async (amount: number) => {
  const { toast } = useToast();
  const browserId = getBrowserId();
  
  console.log('Debug: Incrementing coins for browser ID:', browserId);
  
  // First check if player exists
  const { data: existingPlayer } = await supabase
    .from('players')
    .select('id')
    .eq('browser_id', browserId)
    .maybeSingle();

  if (!existingPlayer) {
    console.log('Debug: Creating new player');
    const { error: createError } = await supabase
      .from('players')
      .insert([{ browser_id: browserId, coins: 0 }]);

    if (createError) {
      console.error('Debug: Error creating player:', createError);
      throw createError;
    }
  }

  const { error } = await supabase.rpc('increment_coins', {
    increment_amount: amount,
    user_telegram_id: browserId
  });

  if (error) {
    console.error('Debug: Error incrementing coins:', error);
    throw error;
  }
};
