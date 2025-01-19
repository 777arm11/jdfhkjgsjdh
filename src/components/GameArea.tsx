import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Target from '@/components/Target';

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

  const generateTarget = useCallback(() => {
    if (!isPlaying) return;
    
    const newTarget: TargetType = {
      id: Date.now(),
      position: {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      },
      isHit: false
    };

    setTargets(prev => [...prev, newTarget]);

    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
    }, 2000);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(generateTarget, 1000);
      return () => clearInterval(interval);
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
    <div className="relative w-full h-full">
      {renderedTargets}
    </div>
  );
};

export default React.memo(GameArea);