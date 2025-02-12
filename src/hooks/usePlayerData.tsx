
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePlayerData = () => {
  const { toast } = useToast();
  
  const { data: playerData, error: playerError } = useQuery({
    queryKey: ['player'],
    queryFn: async () => {
      // Get telegram_id from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const telegramId = urlParams.get('id');
      
      if (!telegramId) {
        console.log('Debug: No telegram ID found in URL');
        toast({
          title: "Test Mode Active",
          description: "Please open this app in Telegram.",
        });
        return { coins: 0 };
      }

      console.log('Debug: Fetching/creating player data for telegram ID:', telegramId);
      
      // First try to get existing player
      let { data: player } = await supabase
        .from('players')
        .select('coins, telegram_id, username')
        .eq('telegram_id', telegramId)
        .maybeSingle();

      // If player doesn't exist, create new player
      if (!player) {
        console.log('Debug: Creating new player');
        const { data: newPlayer, error: createError } = await supabase
          .from('players')
          .insert([
            { 
              telegram_id: telegramId,
              coins: 0,
              username: null
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Debug: Error creating player:', createError);
          throw createError;
        }

        player = newPlayer;
      }
      
      console.log('Debug: Player data:', player);
      return player;
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error('Debug: Error in player data query:', error);
        toast({
          title: "Error",
          description: "Failed to load player data. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  return {
    playerData,
    playerError
  };
};
