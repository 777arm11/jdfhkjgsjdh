
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
        // For development, always allow access
        if (process.env.NODE_ENV === 'development') {
          console.log('Debug: Development mode - bypassing Telegram validation');
          setIsValid(true);
          setIsLoading(false);
          return;
        }

        // Get the init data from URL
        const urlSearchParams = new URLSearchParams(window.location.search);
        const initData = urlSearchParams.get('initData');

        if (!initData) {
          console.log('Debug: No initData found, access denied');
          setIsValid(false);
          toast({
            title: "Invalid Access",
            description: "This game can only be played through Telegram.",
            variant: "destructive",
          });
          return;
        }

        // Call the validate-telegram edge function
        const { data, error } = await supabase.functions.invoke('validate-telegram', {
          body: { initData }
        });

        if (error) {
          console.error('Debug: Validation error:', error);
          throw error;
        }

        setIsValid(data.isValid);

        if (!data.isValid) {
          toast({
            title: "Invalid Access",
            description: "Please access this game through Telegram.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Debug: Error in validation:', error);
        setIsValid(false);
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
