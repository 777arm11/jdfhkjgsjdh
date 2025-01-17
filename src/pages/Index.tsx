import React, { useState, useEffect } from 'react';
import GameArea from '@/components/GameArea';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';
import { useToast } from '@/components/ui/use-toast';

const COINS_PER_HIT = 1; // Changed from 100 to 1 coin per hit
const INITIAL_COINS = 5_000_000_000;

const Index = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [coins, setCoins] = useState(INITIAL_COINS);
  const { toast } = useToast();

  useEffect(() => {
    const savedHighScore = localStorage.getItem('tappingGameHighScore');
    const savedCoins = localStorage.getItem('tappingGameCoins');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    if (savedCoins) {
      setCoins(parseInt(savedCoins));
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
    // Add coins for the hit
    const newCoins = coins + COINS_PER_HIT;
    setCoins(newCoins);
    localStorage.setItem('tappingGameCoins', newCoins.toString());
    
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('tappingGameHighScore', newScore.toString());
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      <ScoreBoard currentScore={score} highScore={highScore} coins={coins} />
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