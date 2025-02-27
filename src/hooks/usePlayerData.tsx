
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getBrowserId } from '@/utils/browserUtils';

export const usePlayerData = () => {
  const { toast } = useToast();
  const browserId = getBrowserId();
  const queryClient = useQueryClient();
  
  const getTelegramData = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const initData = urlSearchParams.get('initData');
    
    if (!initData) return null;
    
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(decodeURIComponent(userStr));
      return user.id ? user.id.toString() : null;
    } catch (e) {
      console.error('Error parsing Telegram user data:', e);
      return null;
    }
  };
  
  const telegramId = getTelegramData();
  
  const { data: playerData, error: playerError } = useQuery({
    queryKey: ['player', browserId, telegramId],
    queryFn: async () => {
      console.log('Debug: Fetching player data for:', { telegramId, browserId });
      
      // Try to get existing player by Telegram ID first
      if (telegramId) {
        const { data: telegramPlayer, error: telegramError } = await supabase
          .from('players')
          .select('*')
          .eq('telegram_id', telegramId)
          .maybeSingle();
          
        if (!telegramError && telegramPlayer) {
          console.log('Debug: Found player by Telegram ID');
          return telegramPlayer;
        }
      }
      
      // If no Telegram player found, try browser_id
      const { data: browserPlayer, error: browserError } = await supabase
        .from('players')
        .select('*')
        .eq('browser_id', browserId)
        .maybeSingle();

      if (!browserError && browserPlayer) {
        // If player exists and we have telegram_id, update it
        if (telegramId && !browserPlayer.telegram_id) {
          const { data: updatedPlayer, error: updateError } = await supabase
            .from('players')
            .update({ telegram_id: telegramId })
            .eq('id', browserPlayer.id)
            .select()
            .single();
            
          if (!updateError && updatedPlayer) {
            return updatedPlayer;
          }
        }
        return browserPlayer;
      }

      // Create new player
      console.log('Debug: Creating new player');
      const { data: newPlayer, error: createError } = await supabase
        .from('players')
        .insert([{ 
          browser_id: browserId,
          telegram_id: telegramId,
          coins: 0
        }])
        .select()
        .single();

      if (createError) {
        console.error('Debug: Error creating player:', createError);
        throw createError;
      }

      return newPlayer;
    },
    retry: 1,
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

  // Add refreshPlayerData function
  const refreshPlayerData = () => {
    queryClient.invalidateQueries({ queryKey: ['player', browserId, telegramId] });
  };

  return {
    playerData,
    playerError,
    telegramId,
    refreshPlayerData
  };
};
