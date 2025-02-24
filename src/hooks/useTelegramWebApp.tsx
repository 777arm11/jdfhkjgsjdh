
import { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          setText: (text: string) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        };
        themeParams: {
          bg_color: string;
          text_color: string;
          hint_color: string;
          button_color: string;
          button_text_color: string;
        };
        colorScheme: 'light' | 'dark';
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
