
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}

export const useTelegramValidation = () => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const validateTelegramData = async () => {
      try {
        // Check if we're in Telegram's WebApp environment
        const isTelegramWebApp = !!window.Telegram?.WebApp;
        console.log('Debug: Is Telegram WebApp?', isTelegramWebApp);

        // Get the init data either from Telegram WebApp or URL
        const initData = window.Telegram?.WebApp?.initData || 
                        new URLSearchParams(window.location.search).get('initData');

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
          // Get user data either from WebApp or URL parameters
          const user = window.Telegram?.WebApp?.initDataUnsafe?.user || (() => {
            const params = new URLSearchParams(initData);
            const userStr = params.get('user');
            return userStr ? JSON.parse(decodeURIComponent(userStr)) : null;
          })();

          if (user?.id) {
            try {
              // Create or update telegram user
              await supabase.rpc('create_telegram_user', {
                p_telegram_id: user.id,
                p_username: user.username || '',
                p_first_name: user.first_name || '',
                p_last_name: user.last_name || ''
              });
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
