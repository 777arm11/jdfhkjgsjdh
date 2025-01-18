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
    <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      <ScoreBoard currentScore={score} highScore={highScore} coins={coins} />
      <GameArea 
        isPlaying={isPlaying} 
        score={score} 
        onScoreUpdate={onScoreUpdate} 
      />
      <GameControls
        onStart={onStart}
        onReset={onReset}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default GameLayout;