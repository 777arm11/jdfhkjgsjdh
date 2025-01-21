import React from 'react';

interface ScoreBoardProps {
  currentScore: number;
  highScore: number;
  coins: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = React.memo(({ currentScore, highScore, coins }) => {
  return (
    <div className="w-full space-y-4 text-center font-pixel">
      <div className="text-2xl font-bold text-game-text border-2 border-game-text p-4 bg-game-secondary">
        Score: {currentScore}
      </div>
      <div className="text-lg text-game-text">High Score: {highScore}</div>
      <div className="text-lg font-medium text-game-text">
        Coins: {coins.toLocaleString()}
      </div>
    </div>
  );
});

ScoreBoard.displayName = 'ScoreBoard';

export default ScoreBoard;