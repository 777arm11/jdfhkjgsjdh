
import { useEffect } from 'react';
import { TelegramWebApp } from '@/types/telegram';

// Update the global Window interface to include the correctly typed Telegram property
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export const useTelegramWebAppInstance = () => {
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

  return {
    webApp,
    isWebAppAvailable: !!webApp,
    colorScheme: webApp?.colorScheme || 'light',
    themeParams: webApp?.themeParams,
  };
};
