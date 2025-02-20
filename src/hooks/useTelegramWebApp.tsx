
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          show: () => void;
          hide: () => void;
          setText: (text: string) => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        initData: string;
        colorScheme: string;
      };
    };
  }
}

export const useTelegramWebApp = () => {
  const [isReady, setIsReady] = useState(false);
  const webapp = window.Telegram?.WebApp;

  useEffect(() => {
    if (webapp) {
      console.log('Debug: Initializing Telegram WebApp');
      try {
        // Initialize the WebApp
        webapp.ready();
        webapp.expand();
        setIsReady(true);

        // Log initialization details
        console.log('Debug: Telegram WebApp initialized successfully');
        console.log('Debug: Color scheme:', webapp.colorScheme);
        console.log('Debug: Init data:', webapp.initData);
      } catch (error) {
        console.error('Debug: Error initializing Telegram WebApp:', error);
      }
    } else {
      console.log('Debug: Telegram WebApp not available');
    }
  }, [webapp]);

  const showMainButton = (text: string, callback: () => void) => {
    if (webapp?.MainButton) {
      try {
        webapp.MainButton.setText(text);
        webapp.MainButton.onClick(callback);
        webapp.MainButton.show();
      } catch (error) {
        console.error('Debug: Error showing main button:', error);
      }
    }
  };

  const hideMainButton = (callback: () => void) => {
    if (webapp?.MainButton) {
      try {
        webapp.MainButton.offClick(callback);
        webapp.MainButton.hide();
      } catch (error) {
        console.error('Debug: Error hiding main button:', error);
      }
    }
  };

  const closeWebApp = () => {
    if (webapp) {
      try {
        webapp.close();
      } catch (error) {
        console.error('Debug: Error closing WebApp:', error);
      }
    }
  };

  return {
    isReady,
    showMainButton,
    hideMainButton,
    closeWebApp,
    initData: webapp?.initData || ''
  };
};
