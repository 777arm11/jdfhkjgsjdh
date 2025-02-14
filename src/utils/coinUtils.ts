
import { supabase } from "@/integrations/supabase/client";
import { getBrowserId } from "./browserUtils";

export const handleCoinIncrement = async (amount: number) => {
  const browserId = getBrowserId();
  
  console.log('Debug: Incrementing coins for browser ID:', browserId);

  const { error } = await supabase.rpc('increment_coins', {
    increment_amount: amount,
    user_telegram_id: browserId
  });

  if (error) {
    console.error('Debug: Error incrementing coins:', error);
    throw error;
  }
};
