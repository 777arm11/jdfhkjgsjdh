import React, { useState, useEffect, useCallback } from 'react';
import Target from '@/components/Target';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';
import { useToast } from '@/components/ui/use-toast';

interface TargetType {
  id: number;
  position: { x: number; y: number };
  isHit: boolean;
}

const Index = () => {
  const [targets, setTargets] = useState<TargetType[]>([]);
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

  const generateTarget = useCallback(() => {
    if (!isPlaying) return;
    
    const newTarget: TargetType = {
      id: Date.now(),
      position: {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      },
      isHit: false
    };

    setTargets(prev => [...prev, newTarget]);

    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
    }, 2000);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(generateTarget, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, generateTarget]);

  const handleTargetClick = (targetId: number) => {
    setTargets(prev =>
      prev.map(t =>
        t.id === targetId ? { ...t, isHit: true } : t
      )
    );
    
    const newScore = score + 1;
    setScore(newScore);
    
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('tappingGameHighScore', newScore.toString());
    }

    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== targetId));
    }, 300);
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTargets([]);
    toast({
      title: "Game Started!",
      description: "Click the circles as fast as you can!",
    });
  };

  const resetGame = () => {
    setIsPlaying(false);
    setTargets([]);
    setScore(0);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      <ScoreBoard currentScore={score} highScore={highScore} />
      
      {targets.map(target => (
        <Target
          key={target.id}
          position={target.position}
          isHit={target.isHit}
          onClick={() => handleTargetClick(target.id)}
        />
      ))}

      <GameControls
        onStart={startGame}
        onReset={resetGame}
        isPlaying={isPlaying}
      />
    </div>
  );
};

export default Index;