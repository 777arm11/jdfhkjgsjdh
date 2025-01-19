import { useState, useCallback, useEffect } from 'react';
import { TargetType } from '@/types/game';

export const useTargetGeneration = (isPlaying: boolean) => {
  const [targets, setTargets] = useState<TargetType[]>([]);

  const generateTarget = useCallback(() => {
    if (!isPlaying) return;
    
    const newTarget: TargetType = {
      id: Date.now(),
      position: {
        x: 50, // Fixed horizontal position at center
        y: Math.random() * 30 + 50  // Spawn between 50-80% of height
      },
      isHit: false
    };

    setTargets(prev => [...prev, newTarget]);

    // Random disappear time between 1.5 and 2.5 seconds
    const disappearTime = 1500 + Math.random() * 1000;
    
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
    }, disappearTime);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const createTargetWithRandomInterval = () => {
        generateTarget();
        // Random interval between 800ms and 1200ms
        const nextSpawnTime = 800 + Math.random() * 400;
        setTimeout(createTargetWithRandomInterval, nextSpawnTime);
      };
      
      // Start generating targets after countdown
      const targetInterval = setTimeout(createTargetWithRandomInterval, 3000);

      return () => clearTimeout(targetInterval);
    } else {
      setTargets([]);
    }
  }, [isPlaying, generateTarget]);

  return { targets, setTargets };
};