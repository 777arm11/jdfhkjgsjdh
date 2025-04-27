
import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="text-3xl font-bold text-white text-center p-4 bg-purple-800/50 rounded-lg backdrop-blur-sm">
      Score: {score}
    </div>
  );
};

export default ScoreDisplay;
