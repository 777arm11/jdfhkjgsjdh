import React, { useState, useCallback, useEffect } from 'react';
import CountdownTimer from '@/components/game/CountdownTimer';
import TargetList from '@/components/game/TargetList';
import { TargetType } from '@/types/game';

interface GameAreaProps {
  isPlaying: boolean;
  score: number;
  onScoreUpdate: (newScore: number) => void;
}

const GameArea: React.FC<GameAreaProps> = ({ isPlaying, score, onScoreUpdate }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [targets, setTargets] = useState<TargetType[]>([]);
  const [mainTargetHit, setMainTargetHit] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      setCountdown(3);
      setMainTargetHit(false);
      setTargets([{
        id: Date.now(),
        position: { x: 50, y: 50 },
        isHit: false,
        isMain: true
      }]);

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
      setTargets([]);
    }
  }, [isPlaying]);

  const generateSmallTargets = useCallback(() => {
    const smallTargets: TargetType[] = [];
    const numTargets = 5;
    const radius = 20; // Distance from center

    for (let i = 0; i < numTargets; i++) {
      const angle = (i * 2 * Math.PI) / numTargets;
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);

      smallTargets.push({
        id: Date.now() + i,
        position: { x, y },
        isHit: false,
        isMain: false
      });
    }

    return smallTargets;
  }, []);

  const handleTargetClick = useCallback((targetId: number) => {
    const target = targets.find(t => t.id === targetId);
    
    if (!target) return;

    if (target.isMain && !mainTargetHit) {
      setMainTargetHit(true);
      setTargets(prev => [
        ...prev.map(t => t.id === targetId ? { ...t, isHit: true } : t),
        ...generateSmallTargets()
      ]);
      onScoreUpdate(score + 2); // More points for hitting main target
    } else if (!target.isMain) {
      setTargets(prev =>
        prev.map(t =>
          t.id === targetId ? { ...t, isHit: true } : t
        ).filter(t => !t.isHit || t.id !== targetId)
      );
      onScoreUpdate(score + 1);
    }

    // Check if all small targets are hit
    const remainingTargets = targets.filter(t => !t.isHit && !t.isMain).length;
    if (remainingTargets <= 1 && mainTargetHit) {
      // Reset for next round
      setMainTargetHit(false);
      setTimeout(() => {
        setTargets([{
          id: Date.now(),
          position: { x: 50, y: 50 },
          isHit: false,
          isMain: true
        }]);
      }, 1000);
    }
  }, [score, onScoreUpdate, targets, mainTargetHit, generateSmallTargets]);

  return (
    <div className="relative w-full h-full bg-gray-50/50 rounded-lg">
      <CountdownTimer countdown={countdown} />
      <TargetList 
        targets={targets} 
        onTargetClick={handleTargetClick} 
      />
    </div>
  );
};

export default React.memo(GameArea);