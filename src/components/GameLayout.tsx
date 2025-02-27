
import React from 'react';
import GameArea from '@/components/GameArea';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';

interface GameLayoutProps {
  coins: number;
  isPlaying: boolean;
  onStart: () => void;
  onReset: () => void;
}

const GameLayout: React.FC<GameLayoutProps> = ({
  coins,
  isPlaying,
  onStart,
  onReset,
}) => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-game-primary transition-all duration-300">
      <div className="w-full h-full px-2 py-4 sm:px-4 sm:py-6 flex flex-col gap-4 sm:gap-8">
        <ScoreBoard coins={coins} />
        <div className="flex-1 relative">
          <GameArea 
            isPlaying={isPlaying}
          />
        </div>
        <div className="mb-4 sm:mb-8">
          <GameControls
            onStart={onStart}
            onReset={onReset}
            isPlaying={isPlaying}
          />
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
