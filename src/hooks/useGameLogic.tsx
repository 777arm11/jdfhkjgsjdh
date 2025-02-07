
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

  // Get telegram ID from URL
  const getTelegramId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const telegramId = urlParams.get('id');
    if (!telegramId) {
      console.log('Debug: No telegram ID found in URL. Running in test mode');
      return null;
    }
    console.log('Debug: Telegram ID found:', telegramId);
    return telegramId;
  };

  // Fetch player data including coins from database
  const { data: playerData, error: playerError } = useQuery({
    queryKey: ['player'],
    queryFn: async () => {
      const telegramId = getTelegramId();
      
      if (!telegramId) {
        console.log('Debug: Running in test mode');
        setTelegramValidated(true); // Allow play without Telegram
        return { coins: 0 };
      }

      console.log('Debug: Fetching player data for telegram ID:', telegramId);
      const { data, error } = await supabase
        .from('players')
        .select('coins, username')
        .eq('telegram_id', telegramId)
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

    if (window.TelegramGameProxy) {
      console.log('Debug: Telegram Game Proxy initialized successfully');
    } else {
      console.log('Debug: Telegram Game Proxy not found - running in test mode');
    }
  }, [telegramValidated]);

  const startGame = () => {
    const telegramId = getTelegramId();
    if (!telegramId) {
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
  };

  const resetGame = () => {
    console.log('Debug: Resetting game');
    setIsPlaying(false);
    setScore(0);
  };

  const updateScore = async (newScore: number) => {
    try {
      const telegramId = getTelegramId();
      setScore(newScore);

      if (telegramId) {
        console.log('Debug: Updating score:', newScore, 'Adding coins:', COINS_PER_HIT);

        // Update coins in database only if we have a Telegram ID
        const { error: incrementError } = await supabase.rpc('increment_coins', {
          user_telegram_id: telegramId,
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
        
        // Update Telegram score only if we're in Telegram
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
