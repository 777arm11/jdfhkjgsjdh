
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';

export const useTelegramValidation = () => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { initData } = useTelegramWebApp();

  useEffect(() => {
    const validateTelegramData = async () => {
      try {
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
          description: "Failed to validate Telegram data. Please try again through Telegram.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    validateTelegramData();
  }, [toast, initData]);

  return { isValid, isLoading };
};
