import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Target from '@/components/Target';
import { cn } from '@/lib/utils';

interface GameAreaProps {
  isPlaying: boolean;
  score: number;
  onScoreUpdate: (newScore: number) => void;
}

interface TargetType {
  id: number;
  position: { x: number; y: number };
  isHit: boolean;
}

const GameArea: React.FC<GameAreaProps> = ({ isPlaying, score, onScoreUpdate }) => {
  const [targets, setTargets] = useState<TargetType[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  const generateTarget = useCallback(() => {
    if (!isPlaying) return;
    
    // Adjusted spawn area to be more centered in the gameplay area
    const newTarget: TargetType = {
      id: Date.now(),
      position: {
        x: Math.random() * 80 + 10, // Use 80% of width, with 10% margin on each side
        y: Math.random() * 20 + 30  // Spawn between 30-50% of height for better visibility
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
      setCountdown(3);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      // Start generating targets after countdown with random intervals
      const targetInterval = setTimeout(() => {
        const createTargetWithRandomInterval = () => {
          generateTarget();
          // Random interval between 800ms and 1200ms
          const nextSpawnTime = 800 + Math.random() * 400;
          setTimeout(createTargetWithRandomInterval, nextSpawnTime);
        };
        
        createTargetWithRandomInterval();
      }, 3000);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(targetInterval);
      };
    } else {
      setCountdown(null);
      setTargets([]);
    }
  }, [isPlaying, generateTarget]);

  const handleTargetClick = useCallback((targetId: number) => {
    setTargets(prev =>
      prev.map(t =>
        t.id === targetId ? { ...t, isHit: true } : t
      )
    );
    
    onScoreUpdate(score + 1);

    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== targetId));
    }, 300);
  }, [score, onScoreUpdate]);

  const renderedTargets = useMemo(() => {
    return targets.map(target => (
      <Target
        key={target.id}
        position={target.position}
        isHit={target.isHit}
        onClick={() => handleTargetClick(target.id)}
      />
    ));
  }, [targets, handleTargetClick]);

  return (
    <div className="relative w-full h-full bg-gray-50/50 rounded-lg">
      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-bold text-primary animate-bounce">
            {countdown}
          </div>
        </div>
      )}
      {renderedTargets}
    </div>
  );
};

export default React.memo(GameArea);