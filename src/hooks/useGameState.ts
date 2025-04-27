
import { useState } from 'react';

export const useGameState = () => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
  };

  const incrementScore = () => {
    setScore(prev => prev + 1);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
  };

  return {
    score,
    isPlaying,
    startGame,
    resetGame,
    incrementScore
  };
};
