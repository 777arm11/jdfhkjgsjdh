import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const COINS_PER_HIT = 1;
const INITIAL_COINS = 5_000_000_000;

export const useGameLogic = () => {
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

    // Initialize Telegram Game Proxy
    if (window.TelegramGameProxy) {
      console.log('Telegram Game Proxy initialized');
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

  const updateScore = async (newScore: number) => {
    setScore(newScore);
    const newCoins = coins + COINS_PER_HIT;
    setCoins(newCoins);
    localStorage.setItem('tappingGameCoins', newCoins.toString());
    
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('tappingGameHighScore', newScore.toString());
      
      // Update Telegram score
      if (window.TelegramGameProxy?.setScore) {
        try {
          window.TelegramGameProxy.setScore(newScore);
          console.log('Score updated in Telegram:', newScore);
        } catch (error) {
          console.error('Error updating Telegram score:', error);
        }
      }

      // Update score in Supabase if user is authenticated
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const telegramId = urlParams.get('id');
        
        if (telegramId) {
          const { error } = await supabase
            .from('players')
            .upsert({
              telegram_id: telegramId,
              coins: newCoins,
            });
            
          if (error) {
            console.error('Error updating player data:', error);
          }
        }
      } catch (error) {
        console.error('Error updating score:', error);
      }
    }
  };

  return {
    score,
    highScore,
    isPlaying,
    coins,
    startGame,
    resetGame,
    updateScore
  };
};
