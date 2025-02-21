
import { useReducer, useCallback, useRef, useEffect } from 'react';
import { TargetType } from '@/types/game';
import { coinService } from '@/services/coinService';
import { useToast } from '@/hooks/use-toast';
import { gameReducer, GameState } from '@/utils/gameUtils';
import { useGlobalCoins } from '@/contexts/GlobalCoinsContext';

export const useTargetManagement = () => {
  const { toast } = useToast();
  const { totalCoins } = useGlobalCoins();
  const timeoutsRef = useRef<number[]>([]);
  const maxTimeouts = 10; // Prevent memory leaks by limiting concurrent timeouts

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

  const addTimeout = useCallback((callback: () => void, delay: number) => {
    if (timeoutsRef.current.length >= maxTimeouts) {
      clearAllTimeouts();
    }
    const timeoutId = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
    return timeoutId;
  }, [clearAllTimeouts, maxTimeouts]);

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
        await coinService.incrementCoins(state.combo * 2); // Double coins for main target
      } else if (!target.isMain) {
        dispatch({ type: 'HIT_TARGET', targetId });
        await coinService.incrementCoins(state.combo);
      }

      const remainingTargets = state.targets.filter(t => !t.isHit && !t.isMain).length;
      if (remainingTargets <= 1 && state.mainTargetHit) {
        addTimeout(spawnMainTarget, 1000);
      }
    } catch (error) {
      console.error('Debug: Error handling target click:', error);
      toast({
        title: "Error",
        description: "Failed to update coins. The operation will be retried automatically.",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [state, spawnMainTarget, addTimeout, toast, totalCoins]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return {
    targets: state.targets,
    mainTargetHit: state.mainTargetHit,
    combo: state.combo,
    handleTargetClick,
    spawnMainTarget,
    clearAllTimeouts
  };
};
