
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useTelegramValidation = () => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const validateTelegramData = async () => {
      try {
        // Debug: Log window.Telegram object
        console.log('Debug: window.Telegram object:', window.Telegram);
        
        // Check for WebApp data first
        const tgWebApp = window.Telegram?.WebApp;
        if (tgWebApp) {
          console.log('Debug: WebApp found:', tgWebApp);
          console.log('Debug: InitData:', tgWebApp.initData);
          console.log('Debug: InitDataUnsafe:', tgWebApp.initDataUnsafe);
          
          // Initialize WebApp
          tgWebApp.ready();
          tgWebApp.expand();
          
          // Set theme variables
          document.documentElement.style.setProperty(
            '--tg-theme-bg-color',
            tgWebApp.backgroundColor || '#ffffff'
          );
          document.documentElement.style.setProperty(
            '--tg-theme-text-color',
            tgWebApp.textColor || '#000000'
          );

          // Validate the init data with our backend
          const { data, error } = await supabase.functions.invoke('validate-telegram', {
            body: { init_data: tgWebApp.initData }
          });

          if (error) {
            console.error('Debug: Validation error:', error);
            throw error;
          }

          console.log('Debug: Validation response:', data);
          setIsValid(true);
          setIsLoading(false);
          return;
        }

        // If we're here, we didn't find valid Telegram WebApp data
        console.log('Debug: No valid Telegram WebApp data found');
        setIsValid(false);
        setIsLoading(false);
        
        toast({
          title: "Invalid Access",
          description: "This game can only be played through Telegram.",
          variant: "destructive",
        });

      } catch (error) {
        console.error('Debug: Error in validation:', error);
        setIsValid(false);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to validate Telegram data. Please try again.",
          variant: "destructive",
        });
      }
    };

    validateTelegramData();
  }, [toast]);

  return { isValid, isLoading };
};
