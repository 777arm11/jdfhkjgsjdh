
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useGameState = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const resetGame = () => {
    // Immediate state reset without async operations
    setIsPlaying(false);
    console.log('Debug: Game reset immediately');
  };

  const startGame = () => {
    setIsPlaying(true);
    console.log('Debug: Game started');
  };

  useEffect(() => {
    const savedHighScore = localStorage.getItem('tappingGameHighScore');
    if (savedHighScore) {
      console.log('Debug: Loaded high score:', savedHighScore);
    }
  }, []);

  return {
    isPlaying,
    startGame,
    resetGame
  };
};
