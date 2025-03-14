import { useEffect, useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TelegramWebApp } from '@/types/telegram';

// Update the global Window interface to include the correctly typed Telegram property
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export const useTelegramWebApp = () => {
  const { toast } = useToast();
  const webApp = window.Telegram?.WebApp;
  const [backButtonVisible, setBackButtonVisible] = useState(false);

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

  const showBackButton = useCallback(() => {
    if (webApp?.BackButton) {
      webApp.BackButton.show();
      setBackButtonVisible(true);
      console.log('Debug: Back button shown');
    } else {
      console.log('Debug: Back button not available');
    }
  }, [webApp]);

  const hideBackButton = useCallback(() => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide();
      setBackButtonVisible(false);
      console.log('Debug: Back button hidden');
    } else {
      console.log('Debug: Back button not available');
    }
  }, [webApp]);

  const onBackButtonClick = useCallback((callback: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.onClick(callback);
      console.log('Debug: Back button click handler set');
    } else {
      console.log('Debug: Back button not available for click handler');
    }
  }, [webApp]);

  const offBackButtonClick = useCallback((callback: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.offClick(callback);
      console.log('Debug: Back button click handler removed');
    } else {
      console.log('Debug: Back button not available for removing click handler');
    }
  }, [webApp]);

  const showPopup = useCallback((title: string, message: string, buttons: Array<{
    id?: string,
    type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive',
    text: string
  }> = [{ text: 'OK', type: 'default' }]) => {
    if (webApp?.showPopup) {
      return new Promise<string>((resolve) => {
        webApp.showPopup({
          title,
          message,
          buttons: buttons.map(btn => ({
            id: btn.id || btn.text.toLowerCase().replace(/\s+/g, '_'),
            type: btn.type || 'default',
            text: btn.text
          })),
        }, (buttonId: string) => {
          resolve(buttonId);
        });
      });
    } else {
      toast({
        title,
        description: message,
      });
      console.log('Debug: Native popup not available, used toast fallback');
      return Promise.resolve('ok');
    }
  }, [webApp, toast]);

  const getUserInfo = useCallback(() => {
    if (webApp?.initDataUnsafe?.user) {
      return webApp.initDataUnsafe.user;
    }
    return null;
  }, [webApp]);

  return {
    hapticFeedback,
    showSuccess,
    showError,
    showBackButton,
    hideBackButton,
    onBackButtonClick,
    offBackButtonClick,
    backButtonVisible,
    showPopup,
    getUserInfo,
    colorScheme: webApp?.colorScheme || 'light',
    themeParams: webApp?.themeParams,
    isWebAppAvailable: !!webApp,
  };
};
