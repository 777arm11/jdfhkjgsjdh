
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const COINS_PER_HIT = 1;
const TELEGRAM_ERROR_MESSAGE = "Please open this game through Telegram to play and earn coins!";

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
      console.log('Debug: No telegram ID found in URL. Current URL:', window.location.href);
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
        console.log('Debug: Query canceled due to missing telegram ID');
        throw new Error(TELEGRAM_ERROR_MESSAGE);
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
          title: "Game Access Error",
          description: error instanceof Error ? error.message : "Failed to load player data",
          variant: "destructive",
        });
        setTelegramValidated(false);
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
      console.log('Debug: Telegram Game Proxy not found');
    }
  }, [telegramValidated]);

  const startGame = () => {
    const telegramId = getTelegramId();
    if (!telegramId || !telegramValidated) {
      console.log('Debug: Game start prevented - Not validated through Telegram');
      toast({
        title: "Access Required",
        description: TELEGRAM_ERROR_MESSAGE,
        variant: "destructive",
      });
      return;
    }
    
    console.log('Debug: Starting game with telegram ID:', telegramId);
    setIsPlaying(true);
    setScore(0);
    toast({
      title: "Game Started!",
      description: "Click the circles as fast as you can!",
    });
  };

  const resetGame = () => {
    if (!telegramValidated) {
      console.log('Debug: Game reset prevented - Not validated through Telegram');
      toast({
        title: "Access Required",
        description: TELEGRAM_ERROR_MESSAGE,
        variant: "destructive",
      });
      return;
    }
    console.log('Debug: Resetting game');
    setIsPlaying(false);
    setScore(0);
  };

  const updateScore = async (newScore: number) => {
    try {
      const telegramId = getTelegramId();
      if (!telegramId || !telegramValidated) {
        console.log('Debug: Score update prevented - Not validated through Telegram');
        toast({
          title: "Access Required",
          description: TELEGRAM_ERROR_MESSAGE,
          variant: "destructive",
        });
        return;
      }

      console.log('Debug: Updating score:', newScore, 'Adding coins:', COINS_PER_HIT);
      setScore(newScore);

      // Update coins in database
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
