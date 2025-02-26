
import { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useTelegramWebApp = () => {
  const { toast } = useToast();
  const webApp = window.Telegram?.WebApp;

  useEffect(() => {
    if (webApp) {
      webApp.ready();
      webApp.expand();
      console.log('Debug: Telegram WebApp ready and expanded');
    } else {
      console.log('Debug: Telegram WebApp not available');
    }
  }, [webApp]);

  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy') => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred(type);
      console.log(`Debug: Haptic feedback ${type}`);
    } else {
      console.log(`Debug: Haptic feedback not available`);
    }
  }, [webApp]);

  const showSuccess = useCallback((message: string) => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred('success');
    }
    toast({
      title: "Success",
      description: message,
    });
    console.log(`Debug: Success notification: ${message}`);
  }, [webApp, toast]);

  const showError = useCallback((message: string) => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred('error');
    }
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
    console.log(`Debug: Error notification: ${message}`);
  }, [webApp, toast]);

  return {
    hapticFeedback,
    showSuccess,
    showError,
    colorScheme: webApp?.colorScheme || 'light',
    themeParams: webApp?.themeParams,
    isWebAppAvailable: !!webApp,
  };
};
