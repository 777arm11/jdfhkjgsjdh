import React from 'react';

interface ScoreBoardProps {
  currentScore: number;
  highScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ currentScore, highScore }) => {
  return (
    <div className="fixed top-4 right-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
      <div className="text-lg font-semibold text-primary">Score: {currentScore}</div>
      <div className="text-sm text-gray-600">High Score: {highScore}</div>
    </div>
  );
};

export default ScoreBoard;