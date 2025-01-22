import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const handleCoinIncrement = async (telegramId: string | null, amount: number) => {
  const { toast } = useToast();
  
  if (!telegramId) {
    throw new Error("Please open this app in Telegram");
  }

  const { error } = await supabase.rpc('increment_coins', {
    user_telegram_id: telegramId,
    increment_amount: amount
  });

  if (error) throw error;
};