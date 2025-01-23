import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useGameLogic = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [coins, setCoins] = useState(0);
  const { toast } = useToast();

  const updateScore = useCallback(async (points: number) => {
    try {
      setIsUpdating(true);
      setScore(prev => prev + points);
      // Update high score if current score is higher
      setHighScore(prev => Math.max(prev, score + points));
    } catch (error) {
      toast({
        title: "Error updating score",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }, [score, toast]);

  const resetScore = useCallback(() => {
    setScore(0);
  }, []);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setScore(0);
  }, []);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setScore(0);
  }, []);

  return {
    score,
    highScore,
    isPlaying,
    coins,
    isUpdating,
    updateScore,
    resetScore,
    startGame,
    resetGame
  };
};