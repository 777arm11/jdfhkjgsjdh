
import { useReducer, useCallback, useRef } from 'react';
import { TargetType } from '@/types/game';
import { coinService } from '@/services/coinService';
import { useToast } from '@/hooks/use-toast';
import { gameReducer, GameState } from '@/utils/gameUtils';
import { useGlobalCoins } from '@/contexts/GlobalCoinsContext';

export const useTargetManagement = (score: number, onScoreUpdate: (newScore: number) => void) => {
  const { toast } = useToast();
  const { totalCoins } = useGlobalCoins();
  const timeoutsRef = useRef<number[]>([]);

  const initialState: GameState = {
    targets: [],
    mainTargetHit: false,
    combo: 1,
    lastHitTime: 0
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  const spawnMainTarget = useCallback(() => {
    clearAllTimeouts();
    dispatch({ type: 'SPAWN_MAIN_TARGET' });
  }, [clearAllTimeouts]);

  const handleTargetClick = useCallback(async (targetId: string) => {
    const target = state.targets.find(t => t.id === targetId);
    
    if (!target || target.isHit) return;

    if (totalCoins < state.combo) {
      toast({
        title: "Global Pool Depleted",
        description: "The global coin pool has been depleted!",
        variant: "destructive",
      });
      return;
    }

    try {
      dispatch({ type: 'UPDATE_COMBO', timestamp: Date.now() });
      
      if (target.isMain && !state.mainTargetHit) {
        dispatch({ type: 'HIT_TARGET', targetId });
        dispatch({ type: 'SPAWN_SMALL_TARGETS' });
        onScoreUpdate(score + (2 * state.combo));
        await coinService.incrementCoins(state.combo);
      } else if (!target.isMain) {
        dispatch({ type: 'HIT_TARGET', targetId });
        onScoreUpdate(score + (1 * state.combo));
        await coinService.incrementCoins(state.combo);
      }

      const remainingTargets = state.targets.filter(t => !t.isHit && !t.isMain).length;
      if (remainingTargets <= 1 && state.mainTargetHit) {
        const timeoutId = window.setTimeout(spawnMainTarget, 1000);
        timeoutsRef.current.push(timeoutId);
      }
    } catch (error) {
      console.error('Error handling target click:', error);
      toast({
        title: "Error",
        description: "Failed to update coins. Please try again.",
        variant: "destructive",
      });
    }
  }, [state, score, onScoreUpdate, spawnMainTarget, toast, totalCoins]);

  return {
    targets: state.targets,
    mainTargetHit: state.mainTargetHit,
    combo: state.combo,
    handleTargetClick,
    spawnMainTarget,
    clearAllTimeouts
  };
};
