import React, { useState, useEffect } from 'react';
import GameArea from '@/components/GameArea';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedHighScore = localStorage.getItem('tappingGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    toast({
      title: "Game Started!",
      description: "Click the circles as fast as you can!",
    });
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
  };

  const updateScore = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('tappingGameHighScore', newScore.toString());
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      <ScoreBoard currentScore={score} highScore={highScore} />
      <GameArea 
        isPlaying={isPlaying} 
        score={score} 
        onScoreUpdate={updateScore} 
      />
      <GameControls
        onStart={startGame}
        onReset={resetGame}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default Index;