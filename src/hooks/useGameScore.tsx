
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useGameScore = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const { toast } = useToast();

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('tappingGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const updateScore = async (newScore: number) => {
    try {
      setScore(newScore);

      if (newScore > highScore) {
        console.log('Debug: New high score achieved:', newScore);
        setHighScore(newScore);
        localStorage.setItem('tappingGameHighScore', newScore.toString());
      }
    } catch (error) {
      console.error('Debug: Error in updateScore:', error);
      toast({
        title: "Error",
        description: "Failed to update score. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return {
    score,
    highScore,
    updateScore
  };
};
