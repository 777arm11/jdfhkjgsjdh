
import { supabase } from "@/integrations/supabase/client";
import { getBrowserId } from "./browserUtils";

export const handleCoinIncrement = async (amount: number) => {
  try {
    const browserId = getBrowserId();
    
    console.log('Debug: Incrementing coins for browser ID:', browserId);

    // First, check if a player record exists
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('id')
      .eq('browser_id', browserId)
      .single();

    if (!existingPlayer) {
      // Create a new player record if none exists
      const { error: insertError } = await supabase
        .from('players')
        .insert([{ browser_id: browserId }]);

      if (insertError) {
        console.error('Debug: Error creating player record:', insertError);
        throw insertError;
      }
    }

    // Now increment the coins
    const { error } = await supabase.rpc('increment_coins', {
      increment_amount: amount,
      user_telegram_id: browserId
    });

    if (error) {
      console.error('Debug: Error incrementing coins:', error);
      throw error;
    }
  } catch (error) {
    console.error('Debug: Error in handleCoinIncrement:', error);
    throw error;
  }
};
