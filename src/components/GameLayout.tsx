import React from 'react';
import GameArea from '@/components/GameArea';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';

interface GameLayoutProps {
  score: number;
  highScore: number;
  coins: number;
  isPlaying: boolean;
  onScoreUpdate: (newScore: number) => void;
  onStart: () => void;
  onReset: () => void;
}

const GameLayout: React.FC<GameLayoutProps> = ({
  score,
  highScore,
  coins,
  isPlaying,
  onScoreUpdate,
  onStart,
  onReset
}) => {
  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden bg-white">
      <div className="max-w-xl mx-auto h-full px-4 py-6 flex flex-col gap-6">
        <ScoreBoard currentScore={score} highScore={highScore} coins={coins} />
        <div className="flex-1 relative">
          <GameArea 
            isPlaying={isPlaying} 
            score={score} 
            onScoreUpdate={onScoreUpdate} 
          />
        </div>
        <div className="mb-16">
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