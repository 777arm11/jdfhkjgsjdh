
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTelegramValidation = () => {
  const getTelegramUser = async () => {
    if (!window.Telegram?.WebApp) {
      console.log('Debug: No Telegram WebApp found. Running in test mode');
      return null;
    }

    const webApp = window.Telegram.WebApp;
    const initData = webApp.initData;
    const user = webApp.initDataUnsafe.user;

    if (!user) {
      console.log('Debug: No user data in WebApp. Running in test mode');
      return null;
    }

    if (!initData) {
      console.log('Debug: No init data found. Running in test mode');
      return null;
    }

    try {
      console.log('Debug: Validating Telegram init data');
      const response = await supabase.functions.invoke('validate-telegram', {
        body: { initData }
      });

      if (!response.data?.isValid) {
        console.error('Debug: Invalid Telegram init data');
        return null;
      }

      console.log('Debug: Telegram user validated:', user);
      return user;
    } catch (error) {
      console.error('Debug: Error validating Telegram data:', error);
      return null;
    }
  };

  const setupTelegramBackButton = (isPlaying: boolean, resetGame: () => void) => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      
      webApp.BackButton.onClick(() => {
        if (isPlaying) {
          resetGame();
        } else {
          webApp.close();
        }
      });
    }
  };

  return {
    getTelegramUser,
    setupTelegramBackButton
  };
};
