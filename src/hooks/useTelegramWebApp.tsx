
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
      // Initialize the WebApp
      webapp.ready();
      webapp.expand();
      setIsReady(true);

      // Log initialization
      console.log('Debug: Telegram WebApp initialized');
      console.log('Debug: Color scheme:', webapp.colorScheme);
      console.log('Debug: Init data:', webapp.initData);
    }
  }, [webapp]);

  const showMainButton = (text: string, callback: () => void) => {
    if (webapp?.MainButton) {
      webapp.MainButton.setText(text);
      webapp.MainButton.onClick(callback);
      webapp.MainButton.show();
    }
  };

  const hideMainButton = (callback: () => void) => {
    if (webapp?.MainButton) {
      webapp.MainButton.offClick(callback);
      webapp.MainButton.hide();
    }
  };

  const closeWebApp = () => {
    webapp?.close();
  };

  return {
    isReady,
    showMainButton,
    hideMainButton,
    closeWebApp,
    initData: webapp?.initData || ''
  };
};
