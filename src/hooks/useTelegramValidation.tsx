
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTelegramValidation = () => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const validateTelegramData = async () => {
      try {
        // Get the init data from URL
        const urlSearchParams = new URLSearchParams(window.location.search);
        const initData = urlSearchParams.get('initData');

        if (!initData) {
          console.log('Debug: No initData found, access denied');
          setIsValid(false);
          toast({
            title: "Invalid Access",
            description: "Please access this game through Telegram.",
            variant: "destructive",
          });
          return;
        }

        console.log('Debug: Validating Telegram initData');
        
        // Call the validate-telegram edge function
        const { data, error } = await supabase.functions.invoke('validate-telegram', {
          body: { initData }
        });

        if (error) {
          console.error('Debug: Validation error:', error);
          throw error;
        }

        console.log('Debug: Validation result:', data);
        setIsValid(data.isValid);

        if (data.isValid) {
          // Parse user data from initData
          const params = new URLSearchParams(initData);
          const userStr = params.get('user');
          if (userStr) {
            try {
              const user = JSON.parse(decodeURIComponent(userStr));
              // Create or update telegram user
              if (user.id) {
                await supabase.rpc('create_telegram_user', {
                  p_telegram_id: user.id,
                  p_username: user.username || '',
                  p_first_name: user.first_name || '',
                  p_last_name: user.last_name || ''
                });
              }
            } catch (e) {
              console.error('Error processing Telegram user data:', e);
            }
          }
        } else {
          toast({
            title: "Invalid Access",
            description: data.reason || "Please access this game through Telegram.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Debug: Error in validation:', error);
        toast({
          title: "Error",
          description: "Failed to validate Telegram data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    validateTelegramData();
  }, [toast]);

  return { isValid, isLoading };
};
