import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGameLogic = () => {
  const [score, setScore] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateScore = useCallback(async (points: number) => {
    try {
      setIsUpdating(true);
      const urlParams = new URLSearchParams(window.location.search);
      const telegramId = urlParams.get('id');

      if (!telegramId) {
        toast({
          title: "Error",
          description: "Please open this game in Telegram",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.rpc('increment_coins', {
        user_telegram_id: telegramId,
        increment_amount: points
      });

      if (error) {
        console.error('Error updating score:', error);
        toast({
          title: "Error",
          description: "Failed to update score. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setScore((prevScore) => prevScore + points);
      toast({
        title: "Success!",
        description: `You earned ${points} coins!`,
      });
    } catch (error) {
      console.error('Error updating score:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }, [toast]);

  const resetScore = useCallback(() => {
    setScore(0);
  }, []);

  return {
    score,
    updateScore,
    resetScore,
    isUpdating
  };
};