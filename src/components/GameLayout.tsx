
import React, { useState } from 'react';
import GameArea from '@/components/game/GameArea';
import ScoreDisplay from '@/components/game/ScoreDisplay';
import GameControls from '@/components/game/GameControls';

const GameLayout: React.FC = () => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
  };

  const incrementScore = () => {
    setScore(prevScore => prevScore + 1);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-purple-900">
      <div className="w-full h-full px-2 py-4 sm:px-4 sm:py-6 flex flex-col gap-4 sm:gap-8">
        <ScoreDisplay score={score} />
        <div className="flex-1 relative">
          <GameArea 
            isPlaying={isPlaying}
            onTargetHit={incrementScore}
          />
        </div>
        <div className="mb-4 sm:mb-8">
          <GameControls
            onStart={startGame}
            onReset={resetGame}
            isPlaying={isPlaying}
          />
        </div>
      </div>
    </div>
  );
};

export default GameLayout;
