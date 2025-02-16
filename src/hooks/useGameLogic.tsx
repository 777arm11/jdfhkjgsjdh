
import { useGameState } from './useGameState';
import { useGameScore } from './useGameScore';
import { usePlayerData } from './usePlayerData';

export const useGameLogic = () => {
  const { isPlaying, startGame, resetGame: baseResetGame } = useGameState();
  const { score, highScore, updateScore } = useGameScore();
  const { playerData } = usePlayerData();

  const resetGame = () => {
    // Immediate reset
    baseResetGame();
    updateScore(0);
  };

  return {
    score,
    highScore,
    isPlaying,
    coins: playerData?.coins || 0,
    startGame,
    resetGame,
    updateScore
  };
};
