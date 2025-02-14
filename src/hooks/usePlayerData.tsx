
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getBrowserId } from '@/utils/browserUtils';

export const usePlayerData = () => {
  const { toast } = useToast();
  
  const { data: playerData, error: playerError } = useQuery({
    queryKey: ['player'],
    queryFn: async () => {
      const browserId = getBrowserId();
      console.log('Debug: Using browser ID:', browserId);
      
      // First try to get existing player
      let { data: player } = await supabase
        .from('players')
        .select('coins, browser_id')
        .eq('browser_id', browserId)
        .maybeSingle();

      // If player doesn't exist, create new player
      if (!player) {
        console.log('Debug: Creating new player');
        const { data: newPlayer, error: createError } = await supabase
          .from('players')
          .insert([
            { 
              browser_id: browserId,
              coins: 0
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
