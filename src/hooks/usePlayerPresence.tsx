
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePlayerData } from '@/hooks/usePlayerData';
import { useToast } from '@/hooks/use-toast';
import { useGlobalCoins } from '@/contexts/GlobalCoinsContext';
import { v4 as uuidv4 } from 'uuid';

export type OnlinePlayer = {
  id: string;
  username: string | null;
  status: string;
  coins: number;
  lastActive: string;
};

export const usePlayerPresence = () => {
  const { playerData, telegramId } = usePlayerData();
  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([]);
  const [activePlayers, setActivePlayers] = useState<number>(0);
  const { toast } = useToast();
  const { refreshTotalCoins } = useGlobalCoins();
  
  // Generate a unique game ID for potential multiplayer sessions
  const generateGameId = () => `game_${uuidv4().substring(0, 8)}`;

  // Update player status to online
  useEffect(() => {
    if (!playerData?.id) return;

    const updatePlayerStatus = async () => {
      try {
        const { error } = await supabase
          .from('players')
          .update({ 
            status: 'online',
            last_active: new Date().toISOString()
          })
          .eq('id', playerData.id);

        if (error) {
          console.error('Error updating player status:', error);
        }
      } catch (error) {
        console.error('Failed to update player status:', error);
      }
    };

    updatePlayerStatus();

    // Set up interval to update last_active timestamp every 30 seconds
    const interval = setInterval(updatePlayerStatus, 30000);

    // Update player status to offline when component unmounts
    return () => {
      clearInterval(interval);
      if (playerData?.id) {
        supabase
          .from('players')
          .update({ 
            status: 'offline' 
          })
          .eq('id', playerData.id)
          .then(({ error }) => {
            if (error) {
              console.error('Error updating player status to offline:', error);
            }
          });
      }
    };
  }, [playerData?.id]);

  // Subscribe to changes in player statuses
  useEffect(() => {
    const channel = supabase
      .channel('player-presence')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: 'status=eq.online'
        }, 
        (payload) => {
          console.debug('Player status change:', payload);
          // Refresh the total coins when player data changes
          refreshTotalCoins();
        }
      )
      .subscribe();

    // Fetch current online players
    const fetchOnlinePlayers = async () => {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('id, username, status, coins, last_active')
          .eq('status', 'online')
          .order('coins', { ascending: false });

        if (error) {
          console.error('Error fetching online players:', error);
          return;
        }

        const formattedPlayers = data.map(player => ({
          id: player.id,
          username: player.username || 'Anonymous',
          status: player.status,
          coins: player.coins || 0,
          lastActive: player.last_active
        }));

        setOnlinePlayers(formattedPlayers);
        setActivePlayers(formattedPlayers.length);
        
        // Show notification if many players are online
        if (formattedPlayers.length > 5) {
          toast({
            title: "Multiplayer Active!",
            description: `${formattedPlayers.length} players are currently online!`,
          });
        }
      } catch (error) {
        console.error('Failed to fetch online players:', error);
      }
    };

    fetchOnlinePlayers();
    // Refresh online players every minute
    const interval = setInterval(fetchOnlinePlayers, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [toast, refreshTotalCoins]);

  return {
    onlinePlayers,
    activePlayers,
    currentPlayerId: playerData?.id,
    generateGameId
  };
};
