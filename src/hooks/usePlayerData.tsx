
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTelegramValidation } from './useTelegramValidation';

export const usePlayerData = () => {
  const { toast } = useToast();
  const { getTelegramUser } = useTelegramValidation();
  
  const { data: playerData, error: playerError } = useQuery({
    queryKey: ['player'],
    queryFn: async () => {
      const user = await getTelegramUser();
      
      if (!user) {
        console.log('Debug: Running in test mode');
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
      return data;
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error('Debug: Error in player data query:', error);
        toast({
          title: "Test Mode Active",
          description: "You're playing in test mode. Coins won't be saved.",
        });
      }
    }
  });

  return {
    playerData,
    playerError
  };
};
