
import { useGameState } from './useGameState';
import { usePlayerData } from './usePlayerData';
import { coinService } from '@/services/coinService';
import { useToast } from '@/hooks/use-toast';

export const useGameLogic = () => {
  const { isPlaying, startGame, resetGame } = useGameState();
  const { playerData } = usePlayerData();
  const { toast } = useToast();

  return {
    isPlaying,
    coins: playerData?.coins || 0,
    startGame,
    resetGame
  };
};
