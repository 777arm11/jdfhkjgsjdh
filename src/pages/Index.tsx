
import React from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import GameLayout from '@/components/GameLayout';
import { useTelegramValidation } from '@/hooks/useTelegramValidation';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const {
    isPlaying,
    coins,
    startGame,
    resetGame
  } = useGameLogic();

  const { isValid, isLoading } = useTelegramValidation();
  const { hapticFeedback, showError, colorScheme } = useTelegramWebApp();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-game-primary">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!isValid) {
    showError("Please access this game through Telegram.");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-game-primary p-4 text-center">
        <h1 className="text-2xl font-pixel text-white mb-4">Invalid Access</h1>
        <p className="text-white/80 font-pixel">
          Please access this game through Telegram.
        </p>
      </div>
    );
  }

  const handleStart = () => {
    hapticFeedback('medium');
    startGame();
  };

  const handleReset = () => {
    hapticFeedback('heavy');
    resetGame();
  };

  return (
    <div className={colorScheme === 'dark' ? 'dark' : ''}>
      <GameLayout
        coins={coins}
        isPlaying={isPlaying}
        onStart={handleStart}
        onReset={handleReset}
      />
    </div>
  );
};

export default Index;
