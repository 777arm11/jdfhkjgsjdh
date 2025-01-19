import React from 'react';

interface ScoreBoardProps {
  currentScore: number;
  highScore: number;
  coins: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = React.memo(({ currentScore, highScore, coins }) => {
  return (
    <div className="w-full space-y-2 text-center">
      <div className="text-2xl font-bold text-purple-600">Score: {currentScore}</div>
      <div className="text-lg text-gray-600">High Score: {highScore}</div>
      <div className="text-lg font-medium text-orange-500">
        Coins: {coins.toLocaleString()}
      </div>
    </div>
  );
});

ScoreBoard.displayName = 'ScoreBoard';

export default ScoreBoard;