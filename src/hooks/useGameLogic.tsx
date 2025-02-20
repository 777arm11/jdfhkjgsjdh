
import { useState, useCallback, useEffect } from 'react';
import { useGameState } from './useGameState';
import { useGameScore } from './useGameScore';
import { usePlayerData } from './usePlayerData';
import { coinService } from '@/services/coinService';
import { useToast } from '@/hooks/use-toast';

export const useGameLogic = () => {
  const { isPlaying, startGame, resetGame: baseResetGame } = useGameState();
  const { score, highScore, updateScore } = useGameScore();
  const { playerData } = usePlayerData();
  const { toast } = useToast();

  // Game mechanics state
  const [combo, setCombo] = useState(1);
  const [lastHitTime, setLastHitTime] = useState(0);

  const handleTargetHit = useCallback(async (isMainTarget: boolean) => {
    try {
      // Update combo based on time between hits
      const now = Date.now();
      const timeDiff = now - lastHitTime;
      const newCombo = timeDiff < 1000 ? Math.min(combo + 1, 5) : 1;
      
      setCombo(newCombo);
      setLastHitTime(now);

      // Calculate points
      const basePoints = isMainTarget ? 2 : 1;
      const points = basePoints * newCombo;

      // Update score
      updateScore(score + points);

      // Award coins
      await coinService.incrementCoins(newCombo);

    } catch (error) {
      console.error('Error handling target hit:', error);
      toast({
        title: "Error",
        description: "Failed to process hit. Please try again.",
        variant: "destructive"
      });
    }
  }, [combo, lastHitTime, score, updateScore, toast]);

  const resetGame = useCallback(() => {
    baseResetGame();
    updateScore(0);
    setCombo(1);
    setLastHitTime(0);
  }, [baseResetGame, updateScore]);

  return {
    score,
    highScore,
    isPlaying,
    combo,
    coins: playerData?.coins || 0,
    startGame,
    resetGame,
    updateScore,
    handleTargetHit
  };
};
