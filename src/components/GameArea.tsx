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

  const getRandomPosition = () => ({
    x: Math.random() * 80 + 10, // Keep target within 10-90% of width
    y: Math.random() * 60 + 20, // Keep target within 20-80% of height
  });

  useEffect(() => {
    if (isPlaying) {
      // Reset state
      setMainTargetHit(false);
      setTargets([]);
      
      // Start countdown
      setCountdown(3);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            // Only spawn the first target after countdown is complete
            if (prev === 1) {
              setTargets([{
                id: Date.now(),
                position: getRandomPosition(),
                isHit: false,
                isMain: true
              }]);
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      // Move main target randomly every 3 seconds (increased from 2s for smoother experience)
      const moveInterval = setInterval(() => {
        if (!mainTargetHit) {
          setTargets(prev => prev.map(target => 
            target.isMain ? { 
              ...target, 
              position: getRandomPosition()
            } : target
          ));
        }
      }, 3000);

      return () => {
        clearInterval(countdownInterval);
        clearInterval(moveInterval);
      };
    } else {
      setCountdown(null);
      setTargets([]);
    }
  }, [isPlaying]);

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

  const handleTargetClick = useCallback((targetId: number) => {
    const target = targets.find(t => t.id === targetId);
    
    if (!target || target.isHit) return;

    if (target.isMain && !mainTargetHit) {
      setMainTargetHit(true);
      setTargets(prev => [
        ...prev.map(t => t.id === targetId ? { ...t, isHit: true } : t),
        ...generateSmallTargets()
      ]);
      onScoreUpdate(score + 2);
    } else if (!target.isMain) {
      setTargets(prev =>
        prev.map(t =>
          t.id === targetId ? { ...t, isHit: true } : t
        ).filter(t => !t.isHit || t.id !== targetId)
      );
      onScoreUpdate(score + 1);
    }

    const remainingTargets = targets.filter(t => !t.isHit && !t.isMain).length;
    if (remainingTargets <= 1 && mainTargetHit) {
      setMainTargetHit(false);
      setTimeout(() => {
        setTargets([{
          id: Date.now(),
          position: getRandomPosition(),
          isHit: false,
          isMain: true
        }]);
      }, 1000);
    }
  }, [score, onScoreUpdate, targets, mainTargetHit, generateSmallTargets]);

  return (
    <div className="relative w-full h-[calc(100vh-20rem)] bg-gray-50/50 rounded-lg">
      <CountdownTimer countdown={countdown} />
      <TargetList 
        targets={targets} 
        onTargetClick={handleTargetClick} 
      />
    </div>
  );
};

export default React.memo(GameArea);