
import React from 'react';
import { useGameLogic } from '@/hooks/useGameLogic';
import GameLayout from '@/components/GameLayout';
import { useTelegramValidation } from '@/hooks/useTelegramValidation';
import { Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <h1 className="text-2xl font-pixel text-white mb-4">Telegram Access Only</h1>
        <p className="text-white/80 font-pixel mb-6">
          This game is exclusively available through Telegram. Please open the game via our Telegram bot.
        </p>
        <Button 
          className="flex items-center gap-2 font-pixel"
          onClick={() => window.open('https://t.me/Hope_Coin_tapbot', '_blank')}
        >
          <MessageCircle className="w-4 h-4" />
          Open in Telegram
        </Button>
      </div>
    );
  }

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
