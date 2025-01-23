import React, { useCallback, useEffect } from 'react';
import CountdownTimer from '@/components/game/CountdownTimer';
import TargetList from '@/components/game/TargetList';
import { useTargetManagement } from '@/hooks/useTargetManagement';
import { useGameCountdown } from '@/hooks/useGameCountdown';
import { TargetType } from '@/types/game';

interface GameAreaProps {
  isPlaying: boolean;
  score: number;
  onScoreUpdate: (newScore: number) => void;
}

const GameArea: React.FC<GameAreaProps> = ({ isPlaying, score, onScoreUpdate }) => {
  const {
    targets,
    setTargets,
    handleTargetClick,
    spawnMainTarget
  } = useTargetManagement(score, onScoreUpdate);

  const countdown = useGameCountdown(isPlaying, spawnMainTarget);

  useEffect(() => {
    if (!isPlaying) {
      setTargets([]);
    }
  }, [isPlaying, setTargets]);

  const mappedTargets = targets.map(target => ({
    id: String(target.id),
    position: target.position,
    isActive: !target.isHit
  }));

  return (
    <div className="relative w-full h-[calc(100vh-20rem)] bg-gray-50/50 rounded-lg">
      <CountdownTimer countdown={countdown} />
      <TargetList 
        targets={mappedTargets}
        onTargetClick={(id) => handleTargetClick(Number(id))}
      />
    </div>
  );
};

export default React.memo(GameArea);