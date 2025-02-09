
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTelegramValidation = () => {
  const getTelegramUser = async () => {
    if (!window.Telegram?.WebApp) {
      console.log('Debug: No Telegram WebApp found, window.Telegram:', window.Telegram);
      return null;
    }

    const webApp = window.Telegram.WebApp;
    console.log('Debug: WebApp object:', webApp);
    
    const initData = webApp.initData;
    console.log('Debug: Init data:', initData);
    
    const user = webApp.initDataUnsafe.user;
    console.log('Debug: User data:', user);

    if (!user) {
      console.log('Debug: No user data in WebApp');
      return null;
    }

    if (!initData) {
      console.log('Debug: No init data found');
      return null;
    }

    try {
      console.log('Debug: Validating Telegram init data with Supabase');
      const response = await supabase.functions.invoke('validate-telegram', {
        body: { initData }
      });

      console.log('Debug: Validation response:', response);

      if (!response.data?.isValid) {
        console.error('Debug: Invalid Telegram init data');
        return null;
      }

      console.log('Debug: Telegram user validated successfully:', user);
      return user;
    } catch (error) {
      console.error('Debug: Error validating Telegram data:', error);
      return null;
    }
  };

  const setupTelegramBackButton = (isPlaying: boolean, resetGame: () => void) => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      console.log('Debug: Setting up Telegram back button');
      
      webApp.BackButton.onClick(() => {
        console.log('Debug: Back button clicked, isPlaying:', isPlaying);
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
