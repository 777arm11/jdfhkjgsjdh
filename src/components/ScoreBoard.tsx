import React from 'react';

interface ScoreBoardProps {
  currentScore: number;
  highScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ currentScore, highScore }) => {
  // Starting with 5,000,000,000 coins as specified in the requirements
  const coins = 5_000_000_000;

  return (
    <div className="fixed top-4 right-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg space-y-2">
      <div className="text-lg font-semibold text-primary">Score: {currentScore}</div>
      <div className="text-sm text-gray-600">High Score: {highScore}</div>
      <div className="text-sm font-medium text-yellow-600">
        Coins: {coins.toLocaleString()}
      </div>
    </div>
  );
};

export default ScoreBoard;