
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTelegramValidation } from './useTelegramValidation';

const COINS_PER_HIT = 1;

export const useGameScore = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const { getTelegramUser } = useTelegramValidation();
  const { toast } = useToast();

  const updateScore = async (newScore: number) => {
    try {
      const user = await getTelegramUser();
      setScore(newScore);

      if (user) {
        console.log('Debug: Updating score:', newScore, 'Adding coins:', COINS_PER_HIT);

        const { error: incrementError } = await supabase.rpc('increment_coins', {
          user_telegram_id: user.id.toString(),
          increment_amount: COINS_PER_HIT
        });

        if (incrementError) {
          console.error('Debug: Error incrementing coins:', incrementError);
          toast({
            title: "Error",
            description: "Failed to update coins. Please try again.",
            variant: "destructive",
          });
          return;
        }

        console.log('Debug: Coins updated successfully');
      }

      if (newScore > highScore) {
        console.log('Debug: New high score achieved:', newScore);
        setHighScore(newScore);
        localStorage.setItem('tappingGameHighScore', newScore.toString());
        
        if (window.TelegramGameProxy?.setScore) {
          try {
            window.TelegramGameProxy.setScore(newScore);
            console.log('Debug: Score updated in Telegram:', newScore);
          } catch (error) {
            console.error('Debug: Error updating Telegram score:', error);
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
