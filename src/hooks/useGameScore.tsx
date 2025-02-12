
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const COINS_PER_HIT = 1;

export const useGameScore = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const { toast } = useToast();

  const updateScore = async (newScore: number) => {
    try {
      setScore(newScore);

      if (newScore > highScore) {
        console.log('Debug: New high score achieved:', newScore);
        setHighScore(newScore);
        localStorage.setItem('tappingGameHighScore', newScore.toString());

        // Get telegram ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const telegramId = urlParams.get('id');

        if (telegramId) {
          console.log('Debug: Incrementing coins for telegram ID:', telegramId);
          const { error } = await supabase.rpc('increment_coins', {
            user_telegram_id: telegramId,
            increment_amount: COINS_PER_HIT
          });

          if (error) {
            console.error('Debug: Error incrementing coins:', error);
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('Debug: Error in updateScore:', error);
      toast({
        title: "Error",
        description: "Failed to update score. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    score,
    highScore,
    updateScore
  };
};
