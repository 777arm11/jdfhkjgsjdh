
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';

export const useTelegramValidation = () => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { initData: webAppInitData } = useTelegramWebApp();

  useEffect(() => {
    const validateTelegramData = async () => {
      try {
        // For development/testing purposes
        if (process.env.NODE_ENV === 'development') {
          console.log('Debug: Development mode, skipping validation');
          setIsValid(true);
          setIsLoading(false);
          return;
        }

        // Get the initData from either URL or WebApp
        const urlInitData = window.location.search.substring(1);
        const initData = urlInitData || webAppInitData;

        console.log('Debug: URL InitData:', urlInitData);
        console.log('Debug: WebApp InitData:', webAppInitData);
        console.log('Debug: Using InitData:', initData);

        if (!initData) {
          console.log('Debug: No initData found in URL or WebApp');
          setIsValid(false);
          toast({
            title: "Access Error",
            description: "Please open this game through Telegram.",
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

        console.log('Debug: Validation result:', data);
        
        // For development/testing, consider all requests valid
        if (process.env.NODE_ENV === 'development') {
          setIsValid(true);
        } else {
          setIsValid(data.isValid);
        }

        if (!data.isValid && process.env.NODE_ENV !== 'development') {
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
          description: "Failed to validate access. Please try again through Telegram.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    validateTelegramData();
  }, [toast, webAppInitData]);

  return { isValid, isLoading };
};
