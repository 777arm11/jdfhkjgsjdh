
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleCoinIncrement } from '@/utils/coinUtils';

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

        console.log('Debug: Incrementing coins for high score');
        await handleCoinIncrement(COINS_PER_HIT);
        
        toast({
          title: "New High Score!",
          description: `You earned ${COINS_PER_HIT} coins!`,
        });
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
