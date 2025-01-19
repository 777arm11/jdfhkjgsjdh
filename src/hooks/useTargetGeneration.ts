import { useState, useCallback, useEffect } from 'react';
import { TargetType } from '@/types/game';

export const useTargetGeneration = (isPlaying: boolean) => {
  const [targets, setTargets] = useState<TargetType[]>([]);

  const generateTarget = useCallback(() => {
    if (!isPlaying) return;
    
    // Random target type generation
    const randomValue = Math.random();
    let type: 'normal' | 'bonus' | 'speed';
    let points: number;
    
    if (randomValue < 0.1) { // 10% chance for bonus
      type = 'bonus';
      points = 5;
    } else if (randomValue < 0.25) { // 15% chance for speed
      type = 'speed';
      points = 3;
    } else {
      type = 'normal';
      points = 1;
    }

    const newTarget: TargetType = {
      id: Date.now(),
      position: {
        x: 50,
        y: Math.random() * 30 + 50
      },
      isHit: false,
      type,
      points
    };

    setTargets(prev => [...prev, newTarget]);

    // Faster disappear time for speed targets
    const baseDisappearTime = type === 'speed' ? 1000 : 1500;
    const randomOffset = Math.random() * 1000;
    const disappearTime = baseDisappearTime + randomOffset;
    
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
    }, disappearTime);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const createTargetWithRandomInterval = () => {
        generateTarget();
        const nextSpawnTime = 800 + Math.random() * 400;
        setTimeout(createTargetWithRandomInterval, nextSpawnTime);
      };
      
      const targetInterval = setTimeout(createTargetWithRandomInterval, 3000);
      return () => clearTimeout(targetInterval);
    } else {
      setTargets([]);
    }
  }, [isPlaying, generateTarget]);

  return { targets, setTargets };
};