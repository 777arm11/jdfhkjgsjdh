
import { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useTelegramWebApp = () => {
  const { toast } = useToast();
  const webApp = window.Telegram?.WebApp;

  useEffect(() => {
    if (webApp) {
      webApp.ready();
      webApp.expand();
    }
  }, [webApp]);

  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy') => {
    webApp?.HapticFeedback?.impactOccurred(type);
  }, [webApp]);

  const showSuccess = useCallback((message: string) => {
    webApp?.HapticFeedback?.notificationOccurred('success');
    toast({
      title: "Success",
      description: message,
    });
  }, [webApp, toast]);

  const showError = useCallback((message: string) => {
    webApp?.HapticFeedback?.notificationOccurred('error');
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }, [webApp, toast]);

  return {
    hapticFeedback,
    showSuccess,
    showError,
    colorScheme: webApp?.colorScheme || 'light',
    themeParams: webApp?.themeParams,
  };
};
