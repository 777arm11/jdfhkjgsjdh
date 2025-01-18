import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GlobalCoinsContextType {
  totalCoins: number;
}

const GlobalCoinsContext = createContext<GlobalCoinsContextType>({ totalCoins: 5_000_000_000 });

export const useGlobalCoins = () => useContext(GlobalCoinsContext);

export const GlobalCoinsProvider = ({ children }: { children: React.ReactNode }) => {
  const [totalCoins, setTotalCoins] = useState(5_000_000_000);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to real-time updates
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
          if (payload.eventType === 'UPDATE') {
            const oldCoins = payload.old?.coins || 0;
            const newCoins = payload.new?.coins || 0;
            const coinDifference = newCoins - oldCoins;
            
            setTotalCoins(current => {
              const updated = current - coinDifference;
              if (updated < 0) {
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

  return (
    <GlobalCoinsContext.Provider value={{ totalCoins }}>
      {children}
    </GlobalCoinsContext.Provider>
  );
};