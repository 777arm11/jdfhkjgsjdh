import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const COINS_PER_HIT = 1;

export const useGameLogic = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  // Get telegram ID from URL
  const getTelegramId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const telegramId = urlParams.get('id');
    if (!telegramId) {
      console.log('No telegram ID found in URL');
      return null;
    }
    return telegramId;
  };

  // Fetch player data including coins from database
  const { data: playerData, error: playerError } = useQuery({
    queryKey: ['player'],
    queryFn: async () => {
      const telegramId = getTelegramId();
      
      if (!telegramId) {
        throw new Error('Please open this game through Telegram');
      }

      const { data, error } = await supabase
        .from('players')
        .select('coins, username')
        .eq('telegram_id', telegramId)
        .single();

      if (error) throw error;
      return data;
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching player data:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load player data",
          variant: "destructive",
        });
      }
    }
  });

  useEffect(() => {
    // Only store high score in localStorage
    const savedHighScore = localStorage.getItem('tappingGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }

    // Initialize Telegram Game Proxy
    if (window.TelegramGameProxy) {
      console.log('Telegram Game Proxy initialized');
    }
  }, []);

  const startGame = () => {
    const telegramId = getTelegramId();
    if (!telegramId) {
      toast({
        title: "Error",
        description: "Please open this game through Telegram",
        variant: "destructive",
      });
      return;
    }
    
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
    try {
      const telegramId = getTelegramId();
      if (!telegramId) {
        toast({
          title: "Error",
          description: "Please open this game through Telegram",
          variant: "destructive",
        });
        return;
      }

      setScore(newScore);

      // Update coins in database
      const { error: incrementError } = await supabase.rpc('increment_coins', {
        user_telegram_id: telegramId,
        increment_amount: COINS_PER_HIT
      });

      if (incrementError) {
        console.error('Error incrementing coins:', incrementError);
        toast({
          title: "Error",
          description: "Failed to update coins. Please try again.",
          variant: "destructive",
        });
        return;
      }

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
      }
    } catch (error) {
      console.error('Error updating score:', error);
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
    updateScore
  };
};