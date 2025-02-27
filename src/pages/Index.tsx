
import React, { useEffect } from 'react';
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
  const { hapticFeedback, showError, colorScheme, isWebAppAvailable } = useTelegramWebApp();

  // Add debug logging
  useEffect(() => {
    console.log('Debug: Game component mounted');
    console.log('Debug: Environment:', process.env.NODE_ENV);
    console.log('Debug: isValid:', isValid, 'isLoading:', isLoading);
    console.log('Debug: Telegram WebApp available:', isWebAppAvailable);
    
    // Log window.Telegram object
    if (window.Telegram) {
      console.log('Debug: window.Telegram exists');
      console.log('Debug: WebApp available:', !!window.Telegram.WebApp);
      if (window.Telegram.WebApp) {
        console.log('Debug: initData exists:', !!window.Telegram.WebApp.initData);
        console.log('Debug: user exists:', !!window.Telegram.WebApp.initDataUnsafe?.user);
      }
    } else {
      console.log('Debug: window.Telegram does not exist');
    }
  }, [isValid, isLoading, isWebAppAvailable]);

  // Move the error notification to useEffect
  useEffect(() => {
    if (!isLoading && !isValid) {
      showError("Please access this game through Telegram.");
    }
  }, [isLoading, isValid, showError]);

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
        <p className="text-white/60 text-sm mt-4">
          To play Taparoo, open the game through Telegram's menu or use the direct link provided in the bot.
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
