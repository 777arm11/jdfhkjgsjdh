import React, { useState, useCallback, useEffect } from 'react';
import { useTargetGeneration } from '@/hooks/useTargetGeneration';
import CountdownTimer from '@/components/game/CountdownTimer';
import TargetList from '@/components/game/TargetList';
import { ComboState } from '@/types/game';
import { useToast } from '@/hooks/use-toast';

interface GameAreaProps {
  isPlaying: boolean;
  score: number;
  onScoreUpdate: (newScore: number) => void;
}

const GameArea: React.FC<GameAreaProps> = ({ isPlaying, score, onScoreUpdate }) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const { targets, setTargets } = useTargetGeneration(isPlaying);
  const [combo, setCombo] = useState<ComboState>({ count: 0, multiplier: 1, lastHitTime: 0 });
  const { toast } = useToast();

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
      setCombo({ count: 0, multiplier: 1, lastHitTime: 0 });
    }
  }, [isPlaying]);

  const handleTargetClick = useCallback((targetId: number) => {
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    const now = Date.now();
    const timeSinceLastHit = now - combo.lastHitTime;
    
    // Update combo if hit within 1.5 seconds
    let newCombo = { ...combo };
    if (timeSinceLastHit < 1500) {
      newCombo.count += 1;
      newCombo.multiplier = Math.min(4, 1 + Math.floor(newCombo.count / 5));
      
      if (newCombo.multiplier > combo.multiplier) {
        toast({
          title: `${newCombo.multiplier}x Combo!`,
          description: "Keep going!",
          duration: 1000,
        });
      }
    } else {
      newCombo = { count: 1, multiplier: 1, lastHitTime: now };
    }
    newCombo.lastHitTime = now;
    setCombo(newCombo);

    // Calculate points with combo multiplier
    const points = target.points * newCombo.multiplier;
    onScoreUpdate(score + points);

    // Visual feedback for points
    toast({
      title: `+${points} points!`,
      description: target.type === 'bonus' ? "Bonus Target!" : 
                  target.type === 'speed' ? "Speed Target!" : "",
      duration: 1000,
    });

    setTargets(prev =>
      prev.map(t =>
        t.id === targetId ? { ...t, isHit: true } : t
      )
    );
    
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== targetId));
    }, 300);
  }, [score, onScoreUpdate, setTargets, combo, toast, targets]);

  return (
    <div className="relative w-full h-full bg-gray-50/50 rounded-lg">
      <CountdownTimer countdown={countdown} />
      <TargetList targets={targets} onTargetClick={handleTargetClick} />
      {combo.multiplier > 1 && (
        <div className="absolute top-4 right-4 bg-primary/80 text-white px-3 py-1 rounded-full animate-pulse">
          {combo.multiplier}x Combo!
        </div>
      )}
    </div>
  );
};

export default React.memo(GameArea);