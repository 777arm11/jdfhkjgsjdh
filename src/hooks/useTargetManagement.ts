
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
  const maxTimeouts = 10;

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
    dispatch({ type: 'RESET_GAME' }); // Dispatch reset action when clearing timeouts
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

    if (totalCoins < 1) {
      toast({
        title: "Global Pool Depleted",
        description: "The global coin pool has been depleted!",
        variant: "destructive",
      });
      return;
    }

    // Immediately update UI for target hit
    dispatch({ type: 'HIT_TARGET', targetId });

    if (target.isMain && !state.mainTargetHit) {
      // Spawn new targets immediately for main target
      dispatch({ type: 'SPAWN_SMALL_TARGETS' });
      // Handle coin increment in background
      coinService.incrementCoins(1).catch(error => {
        console.error('Failed to increment coins:', error);
        toast({
          title: "Error",
          description: "Failed to update coins. Will retry automatically.",
          variant: "destructive",
        });
      });
    } else if (!target.isMain) {
      // Handle coin increment in background for regular targets
      coinService.incrementCoins(1).catch(error => {
        console.error('Failed to increment coins:', error);
        toast({
          title: "Error",
          description: "Failed to update coins. Will retry automatically.",
          variant: "destructive",
        });
      });
    }

    // Check remaining targets and spawn new main target if needed
    const remainingTargets = state.targets.filter(t => !t.isHit && !t.isMain).length;
    if (remainingTargets <= 1 && state.mainTargetHit) {
      addTimeout(spawnMainTarget, 1000);
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
