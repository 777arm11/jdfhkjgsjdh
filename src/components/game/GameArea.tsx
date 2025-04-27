
import React, { useEffect } from 'react';
import { useTargetManagement } from '@/hooks/useTargetManagement';
import { useGameCountdown } from '@/hooks/useGameCountdown';
import CountdownTimer from './CountdownTimer';
import TargetList from './TargetList';

interface GameAreaProps {
  isPlaying: boolean;
  onTargetHit: () => void;
}

const GameArea: React.FC<GameAreaProps> = ({ isPlaying, onTargetHit }) => {
  const {
    targets,
    handleTargetClick,
    spawnMainTarget,
    clearAllTimeouts
  } = useTargetManagement();

  const handleTargetHit = (targetId: string) => {
    handleTargetClick(targetId);
    onTargetHit();
  };

  const countdown = useGameCountdown(isPlaying, spawnMainTarget);

  useEffect(() => {
    if (!isPlaying) {
      clearAllTimeouts();
    }
    return () => clearAllTimeouts();
  }, [isPlaying, clearAllTimeouts]);

  return (
    <div className="relative w-full h-[calc(100vh-16rem)] bg-purple-950/80 rounded-lg overflow-hidden">
      <div className="absolute inset-0 border-2 border-purple-400/30 rounded-lg" />
      
      <CountdownTimer countdown={countdown} />
      <TargetList 
        targets={targets} 
        onTargetClick={handleTargetHit} 
      />
    </div>
  );
};

export default GameArea;
