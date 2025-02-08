
import { useGameState } from './useGameState';
import { useGameScore } from './useGameScore';
import { usePlayerData } from './usePlayerData';

export const useGameLogic = () => {
  const { isPlaying, telegramValidated, setTelegramValidated, startGame, resetGame } = useGameState();
  const { score, highScore, updateScore } = useGameScore();
  const { playerData } = usePlayerData();

  return {
    score,
    highScore,
    isPlaying,
    coins: playerData?.coins || 0,
    startGame,
    resetGame,
    updateScore,
    telegramValidated
  };
};
