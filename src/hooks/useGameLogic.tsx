
import { useGameState } from './useGameState';
import { usePlayerData } from './usePlayerData';
import { coinService } from '@/services/coinService';
import { useToast } from '@/hooks/use-toast';
import { useTargetManagement } from './useTargetManagement';

export const useGameLogic = () => {
  const { isPlaying, startGame, resetGame } = useGameState();
  const { playerData } = usePlayerData();
  const { clearAllTimeouts } = useTargetManagement();
  const { toast } = useToast();

  const handleReset = () => {
    clearAllTimeouts();
    resetGame();
  };

  return {
    isPlaying,
    coins: playerData?.coins || 0,
    startGame,
    resetGame: handleReset
  };
};
