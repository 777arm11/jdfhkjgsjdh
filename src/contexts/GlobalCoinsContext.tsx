
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { coinService } from '@/services/coinService';

interface GlobalCoinsContextType {
  totalCoins: number;
  isLoading: boolean;
  error: Error | null;
}

const GlobalCoinsContext = createContext<GlobalCoinsContextType>({
  totalCoins: 5_000_000_000,
  isLoading: false,
  error: null
});

export const useGlobalCoins = () => useContext(GlobalCoinsContext);

export const GlobalCoinsProvider = ({ children }: { children: React.ReactNode }) => {
  const [totalCoins, setTotalCoins] = useState(5_000_000_000);
  const { toast } = useToast();

  // Fetch initial total coins from all players
  const { isLoading, error } = useQuery({
    queryKey: ['totalCoins'],
    queryFn: async () => {
      console.log('Debug: Fetching total coins in circulation');
      const { data, error } = await supabase
        .from('players')
        .select('coins');
      
      if (error) {
        console.error('Debug: Error fetching total coins:', error);
        throw error;
      }
      
      const total = data.reduce((sum, player) => sum + (player.coins || 0), 0);
      console.log('Debug: Total coins in circulation:', total);
      const remaining = 5_000_000_000 - total;
      const finalRemaining = remaining >= 0 ? remaining : 0;
      
      console.log('Debug: Remaining coins in pool:', finalRemaining);
      setTotalCoins(finalRemaining);
      return finalRemaining;
    },
  });

  useEffect(() => {
    // Subscribe to real-time updates for the players table
    const channel = supabase
      .channel('public:players')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players'
        },
        (payload) => {
          console.log('Debug: Received realtime update:', payload);
          
          if (payload.eventType === 'UPDATE') {
            const oldCoins = payload.old?.coins || 0;
            const newCoins = payload.new?.coins || 0;
            const coinDifference = newCoins - oldCoins;
            
            console.log('Debug: Coin difference:', coinDifference);
            
            setTotalCoins(current => {
              const updated = current - coinDifference;
              if (updated < 0) {
                console.log('Debug: Pool depleted!');
                toast({
                  title: "Pool Depleted",
                  description: "The global coin pool has been depleted!",
                  variant: "destructive",
                });
                return 0;
              }
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  if (error) {
    console.error('Debug: Error in GlobalCoinsContext:', error);
    toast({
      title: "Error",
      description: "Failed to fetch global coin data",
      variant: "destructive",
    });
  }

  return (
    <GlobalCoinsContext.Provider value={{ totalCoins, isLoading, error }}>
      {children}
    </GlobalCoinsContext.Provider>
  );
};
