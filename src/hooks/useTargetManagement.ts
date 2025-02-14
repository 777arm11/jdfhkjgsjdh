
import { useState, useCallback } from 'react';
import { TargetType } from '@/types/game';
import { handleCoinIncrement } from '@/utils/coinUtils';
import { useToast } from '@/hooks/use-toast';

const getRandomPosition = () => ({
  x: Math.random() * 80 + 10,
  y: Math.random() * 60 + 20,
});

export const useTargetManagement = (score: number, onScoreUpdate: (newScore: number) => void) => {
  const [targets, setTargets] = useState<TargetType[]>([]);
  const [mainTargetHit, setMainTargetHit] = useState(false);
  const { toast } = useToast();

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
    setTargets([{
      id: Date.now(),
      position: getRandomPosition(),
      isHit: false,
      isMain: true
    }]);
    setMainTargetHit(false);
  }, []);

  const handleTargetClick = useCallback(async (targetId: number) => {
    const target = targets.find(t => t.id === targetId);
    
    if (!target || target.isHit) return;

    try {
      if (target.isMain && !mainTargetHit) {
        setMainTargetHit(true);
        setTargets(prev => [
          ...prev.map(t => t.id === targetId ? { ...t, isHit: true } : t),
          ...generateSmallTargets()
        ]);
        onScoreUpdate(score + 2);
        await handleCoinIncrement(1);
      } else if (!target.isMain) {
        setTargets(prev =>
          prev.map(t =>
            t.id === targetId ? { ...t, isHit: true } : t
          ).filter(t => !t.isHit || t.id !== targetId)
        );
        onScoreUpdate(score + 1);
        await handleCoinIncrement(1);
      }

      const remainingTargets = targets.filter(t => !t.isHit && !t.isMain).length;
      if (remainingTargets <= 1 && mainTargetHit) {
        setMainTargetHit(false);
        setTimeout(spawnMainTarget, 1000);
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
  }, [score, onScoreUpdate, targets, mainTargetHit, generateSmallTargets, spawnMainTarget, toast]);

  return {
    targets,
    setTargets,
    mainTargetHit,
    setMainTargetHit,
    handleTargetClick,
    spawnMainTarget
  };
};
