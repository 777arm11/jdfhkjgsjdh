
import { useState, useCallback, useRef } from 'react';
import { TargetType } from '@/types/game';
import { handleCoinIncrement } from '@/utils/coinUtils';
import { toast } from '@/hooks/use-toast';

const getRandomPosition = () => ({
  x: Math.random() * 80 + 10,
  y: Math.random() * 60 + 20,
});

export const useTargetManagement = (score: number, onScoreUpdate: (newScore: number) => void) => {
  const [targets, setTargets] = useState<TargetType[]>([]);
  const [mainTargetHit, setMainTargetHit] = useState(false);
  const [combo, setCombo] = useState(1);
  const [lastHitTime, setLastHitTime] = useState(0);
  const timeoutsRef = useRef<number[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  const generateSmallTargets = useCallback(() => {
    const smallTargets: TargetType[] = [];
    const numTargets = 5;
    
    for (let i = 0; i < numTargets; i++) {
      smallTargets.push({
        id: Date.now() + i,
        position: getRandomPosition(),
        isHit: false,
        isMain: false
      });
    }

    return smallTargets;
  }, []);

  const spawnMainTarget = useCallback(() => {
    clearAllTimeouts(); // Clear any pending timeouts before spawning new target
    setTargets([{
      id: Date.now(),
      position: getRandomPosition(),
      isHit: false,
      isMain: true
    }]);
    setMainTargetHit(false);
    setCombo(1);
  }, [clearAllTimeouts]);

  const handleTargetClick = useCallback(async (targetId: number) => {
    const target = targets.find(t => t.id === targetId);
    const currentTime = Date.now();
    
    if (!target || target.isHit) return;

    if (currentTime - lastHitTime < 1000) {
      setCombo(prev => Math.min(prev + 1, 5));
    } else {
      setCombo(1);
    }
    setLastHitTime(currentTime);

    try {
      if (target.isMain && !mainTargetHit) {
        setMainTargetHit(true);
        setTargets(prev => [
          ...prev.map(t => t.id === targetId ? { ...t, isHit: true } : t),
          ...generateSmallTargets()
        ]);
        onScoreUpdate(score + (2 * combo));
        await handleCoinIncrement(combo);
      } else if (!target.isMain) {
        setTargets(prev =>
          prev.map(t =>
            t.id === targetId ? { ...t, isHit: true } : t
          ).filter(t => !t.isHit || t.id !== targetId)
        );
        onScoreUpdate(score + (1 * combo));
        await handleCoinIncrement(combo);
      }

      const remainingTargets = targets.filter(t => !t.isHit && !t.isMain).length;
      if (remainingTargets <= 1 && mainTargetHit) {
        setMainTargetHit(false);
        const timeoutId = window.setTimeout(spawnMainTarget, 1000);
        timeoutsRef.current.push(timeoutId);
      }
    } catch (error) {
      console.error('Debug: Error handling target click:', error);
      toast({
        title: "Error",
        description: "Failed to update coins. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [score, onScoreUpdate, targets, mainTargetHit, generateSmallTargets, spawnMainTarget, combo]);

  // Clean up function is now exposed to be used by the game reset
  return {
    targets,
    setTargets,
    mainTargetHit,
    setMainTargetHit,
    handleTargetClick,
    spawnMainTarget,
    combo,
    clearAllTimeouts
  };
};
