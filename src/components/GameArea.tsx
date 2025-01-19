import React, { useState, useCallback, useEffect } from 'react';
import { useTargetGeneration } from '@/hooks/useTargetGeneration';
import CountdownTimer from '@/components/game/CountdownTimer';
import TargetList from '@/components/game/TargetList';

interface GameAreaProps {
  isPlaying: boolean;
  score: number;
  onScoreUpdate: (newScore: number) => void;
}

const GameArea: React.FC<GameAreaProps> = ({ isPlaying, score, onScoreUpdate }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const { targets, setTargets } = useTargetGeneration(isPlaying);

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

      return () => clearInterval(countdownInterval);
    } else {
      setCountdown(null);
    }
  }, [isPlaying]);

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
  }, [score, onScoreUpdate, setTargets]);

  return (
    <div className="relative w-full h-full bg-gray-50/50 rounded-lg">
      <CountdownTimer countdown={countdown} />
      <TargetList targets={targets} onTargetClick={handleTargetClick} />
    </div>
  );
};

export default React.memo(GameArea);