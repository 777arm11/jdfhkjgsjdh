
import React from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import GameLayout from '@/components/GameLayout';
import { useTelegramValidation } from '@/hooks/useTelegramValidation';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const {
    isPlaying,
    coins,
    startGame,
    resetGame
  } = useGameLogic();

  const { isValid, isLoading } = useTelegramValidation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-game-primary">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-game-primary p-4 text-center">
        <h1 className="text-2xl font-pixel text-white mb-4">Invalid Access</h1>
        <p className="text-white/80 font-pixel">
          Please access this game through Telegram.
        </p>
      </div>
    );
  }

  return (
    <GameLayout
      coins={coins}
      isPlaying={isPlaying}
      onStart={startGame}
      onReset={resetGame}
    />
  );
};

export default Index;
