
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTelegramValidation } from './useTelegramValidation';

export const useGameState = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [telegramValidated, setTelegramValidated] = useState(false);
  const { getTelegramUser, setupTelegramBackButton } = useTelegramValidation();
  const { toast } = useToast();

  const resetGame = () => {
    console.log('Debug: Resetting game');
    setIsPlaying(false);

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.hide();
    }
  };

  const startGame = async () => {
    const user = await getTelegramUser();
    if (!user) {
      console.log('Debug: Starting game in test mode');
      toast({
        title: "Test Mode Active",
        description: "You're playing in test mode. Coins won't be saved.",
      });
    }
    
    setIsPlaying(true);
    toast({
      title: "Game Started!",
      description: "Click the circles as fast as you can!",
    });

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.show();
    }
  };

  useEffect(() => {
    if (telegramValidated) {
      const savedHighScore = localStorage.getItem('tappingGameHighScore');
      if (savedHighScore) {
        console.log('Debug: Loaded high score:', savedHighScore);
      }
    }

    setupTelegramBackButton(isPlaying, resetGame);
  }, [telegramValidated, isPlaying]);

  return {
    isPlaying,
    telegramValidated,
    setTelegramValidated,
    startGame,
    resetGame
  };
};
