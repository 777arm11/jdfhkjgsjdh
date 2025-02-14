
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getBrowserId } from "./browserUtils";

export const handleCoinIncrement = async (amount: number) => {
  const { toast } = useToast();
  const browserId = getBrowserId();
  
  console.log('Debug: Incrementing coins for browser ID:', browserId);
  
  const { error } = await supabase.rpc('increment_coins_browser', {
    user_browser_id: browserId,
    increment_amount: amount
  });

  if (error) {
    console.error('Debug: Error incrementing coins:', error);
    throw error;
  }
};
