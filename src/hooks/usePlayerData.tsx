
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePlayerData = () => {
  const { toast } = useToast();
  
  const { data: playerData, error: playerError } = useQuery({
    queryKey: ['player'],
    queryFn: async () => {
      console.log('Debug: Running in test mode');
      return { coins: 0 };
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
