
import React, { useEffect } from 'react';
import CountdownTimer from '@/components/game/CountdownTimer';
import TargetList from '@/components/game/TargetList';
import { useTargetManagement } from '@/hooks/useTargetManagement';
import { useGameCountdown } from '@/hooks/useGameCountdown';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import { usePlayerPresence } from '@/hooks/usePlayerPresence';

interface GameAreaProps {
  isPlaying: boolean;
}

const GameArea: React.FC<GameAreaProps> = ({ isPlaying }) => {
  const {
    targets,
    handleTargetClick,
    spawnMainTarget,
    combo,
    clearAllTimeouts
  } = useTargetManagement();

  const { hapticFeedback } = useTelegramWebApp();
  const countdown = useGameCountdown(isPlaying, spawnMainTarget);
  const { activePlayers } = usePlayerPresence();

  useEffect(() => {
    if (!isPlaying) {
      clearAllTimeouts();
    }
  }, [isPlaying, clearAllTimeouts]);

  const handleTargetHit = (targetId: string) => {
    hapticFeedback('light');
    handleTargetClick(targetId);
  };

  return (
    <div className="relative w-full h-[calc(100vh-12rem)] sm:h-[calc(100vh-14rem)] bg-black/80 rounded-lg overflow-hidden transition-all duration-300 ease-in-out">
      {/* Game area boundary indicators */}
      <div className="absolute inset-0 border-4 border-purple-400/50 rounded-lg pointer-events-none" />
      <div className="absolute inset-0 border border-purple-300/40 rounded-lg pointer-events-none" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20 pointer-events-none">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="border border-purple-500/40" />
        ))}
      </div>

      {/* Multiplayer indicator */}
      {activePlayers > 1 && (
        <div className="absolute top-16 left-4 bg-game-accent/80 text-white px-3 py-1 rounded-full font-pixel text-sm z-10">
          Multiplayer Active
        </div>
      )}

      {/* Combo multiplier */}
      {combo > 1 && (
        <div className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-full font-pixel animate-bounce">
          {combo}x Combo!
        </div>
      )}

      <CountdownTimer countdown={countdown} />
      <TargetList 
        targets={targets} 
        onTargetClick={handleTargetHit} 
      />
    </div>
  );
};

export default React.memo(GameArea);
