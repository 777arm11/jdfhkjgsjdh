
import React from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import GameLayout from '@/components/GameLayout';

const Index = () => {
  const {
    score,
    highScore,
    isPlaying,
    coins,
    startGame,
    resetGame,
    updateScore
  } = useGameLogic();

  return (
    <GameLayout
      score={score}
      highScore={highScore}
      coins={coins}
      isPlaying={isPlaying}
      onScoreUpdate={updateScore}
      onStart={startGame}
      onReset={resetGame}
    />
  );
};

export default Index;
