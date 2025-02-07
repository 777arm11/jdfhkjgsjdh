
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const COINS_PER_HIT = 1;
const TELEGRAM_ERROR_MESSAGE = "You're playing in test mode. Coins won't be saved.";

export const useGameLogic = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [telegramValidated, setTelegramValidated] = useState(false);
  const { toast } = useToast();

  // Get telegram user from WebApp data
  const getTelegramUser = () => {
    if (!window.Telegram?.WebApp) {
      console.log('Debug: No Telegram WebApp found. Running in test mode');
      return null;
    }

    const user = window.Telegram.WebApp.initDataUnsafe.user;
    if (!user) {
      console.log('Debug: No user data in WebApp. Running in test mode');
      return null;
    }

    console.log('Debug: Telegram user found:', user);
    return user;
  };

  // Fetch player data including coins from database
  const { data: playerData, error: playerError } = useQuery({
    queryKey: ['player'],
    queryFn: async () => {
      const user = getTelegramUser();
      
      if (!user) {
        console.log('Debug: Running in test mode');
        setTelegramValidated(true); // Allow play without Telegram
        return { coins: 0 };
      }

      console.log('Debug: Fetching player data for telegram ID:', user.id);
      const { data, error } = await supabase
        .from('players')
        .select('coins, username')
        .eq('telegram_id', user.id.toString())
        .single();

      if (error) {
        console.error('Debug: Supabase error:', error);
        throw error;
      }
      
      console.log('Debug: Player data fetched successfully:', data);
      setTelegramValidated(true);
      return data;
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error('Debug: Error in player data query:', error);
        toast({
          title: "Test Mode Active",
          description: TELEGRAM_ERROR_MESSAGE,
        });
        setTelegramValidated(true); // Allow play without Telegram
      }
    }
  });

  useEffect(() => {
    if (telegramValidated) {
      console.log('Debug: Loading high score from localStorage');
      const savedHighScore = localStorage.getItem('tappingGameHighScore');
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore));
        console.log('Debug: Loaded high score:', savedHighScore);
      }
    }

    // Setup Telegram WebApp if available
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      // Configure back button
      webApp.BackButton.onClick(() => {
        if (isPlaying) {
          resetGame();
        } else {
          webApp.close();
        }
      });
    }
  }, [telegramValidated]);

  const startGame = () => {
    const user = getTelegramUser();
    if (!user) {
      console.log('Debug: Starting game in test mode');
      toast({
        title: "Test Mode Active",
        description: TELEGRAM_ERROR_MESSAGE,
      });
    }
    
    setIsPlaying(true);
    setScore(0);
    toast({
      title: "Game Started!",
      description: "Click the circles as fast as you can!",
    });

    // Show back button in Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.show();
    }
  };

  const resetGame = () => {
    console.log('Debug: Resetting game');
    setIsPlaying(false);
    setScore(0);

    // Hide back button in Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.BackButton.hide();
    }
  };

  const updateScore = async (newScore: number) => {
    try {
      const user = getTelegramUser();
      setScore(newScore);

      if (user) {
        console.log('Debug: Updating score:', newScore, 'Adding coins:', COINS_PER_HIT);

        // Update coins in database
        const { error: incrementError } = await supabase.rpc('increment_coins', {
          user_telegram_id: user.id.toString(),
          increment_amount: COINS_PER_HIT
        });

        if (incrementError) {
          console.error('Debug: Error incrementing coins:', incrementError);
          toast({
            title: "Error",
            description: "Failed to update coins. Please try again.",
            variant: "destructive",
          });
          return;
        }

        console.log('Debug: Coins updated successfully');
      }

      if (newScore > highScore) {
        console.log('Debug: New high score achieved:', newScore);
        setHighScore(newScore);
        localStorage.setItem('tappingGameHighScore', newScore.toString());
        
        // Update Telegram score
        if (window.TelegramGameProxy?.setScore) {
          try {
            window.TelegramGameProxy.setScore(newScore);
            console.log('Debug: Score updated in Telegram:', newScore);
          } catch (error) {
            console.error('Debug: Error updating Telegram score:', error);
          }
        }
      }
    } catch (error) {
      console.error('Debug: Error in updateScore:', error);
      toast({
        title: "Error",
        description: "Failed to update score. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    score,
    highScore,
    isPlaying,
    coins: playerData?.coins || 0,
    startGame,
    resetGame,
    updateScore,
    telegramValidated
  };
};
