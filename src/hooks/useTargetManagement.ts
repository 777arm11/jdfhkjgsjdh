
import { useReducer, useCallback, useRef, useEffect } from 'react';
import { gameReducer, GameState } from '@/utils/gameUtils';

export const useTargetManagement = () => {
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
    dispatch({ type: 'RESET_GAME' });
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

  const handleTargetClick = useCallback((targetId: string) => {
    const target = state.targets.find(t => t.id === targetId);
    
    if (!target || target.isHit) return;

    dispatch({ type: 'HIT_TARGET', targetId });
    dispatch({ type: 'UPDATE_COMBO', timestamp: Date.now() });

    if (target.isMain && !state.mainTargetHit) {
      dispatch({ type: 'SPAWN_SMALL_TARGETS' });
    }

    const remainingTargets = state.targets.filter(t => !t.isHit && !t.isMain).length;
    if (remainingTargets <= 1 && state.mainTargetHit) {
      addTimeout(spawnMainTarget, 1000);
    }
  }, [state, spawnMainTarget, addTimeout]);

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
