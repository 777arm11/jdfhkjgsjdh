
import { useCallback } from 'react';
import { useTelegramWebAppInstance } from '@/hooks/useTelegramWebAppInstance';

export const useTelegramNotifications = () => {
  const { webApp } = useTelegramWebAppInstance();

  const hapticFeedback = useCallback(
    (style: 'light' | 'medium' | 'heavy') => {
      webApp?.HapticFeedback?.impactOccurred(style);
    },
    [webApp]
  );

  const showSuccess = useCallback(
    () => {
      webApp?.HapticFeedback?.notificationOccurred('success');
    },
    [webApp]
  );

  const showError = useCallback(
    () => {
      webApp?.HapticFeedback?.notificationOccurred('error');
    },
    [webApp]
  );

  const showPopup = useCallback(
    (params: {
      title: string;
      message: string;
      buttons: Array<{
        id: string;
        type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
        text: string;
      }>;
    }, callback: (buttonId: string) => void) => {
      webApp?.showPopup?.(params, callback);
    },
    [webApp]
  );

  return {
    hapticFeedback,
    showSuccess,
    showError,
    showPopup,
  };
};
