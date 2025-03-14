
import { useCallback } from 'react';
import { useTelegramWebAppInstance } from '@/hooks/useTelegramWebAppInstance';

export const useTelegramUser = () => {
  const { webApp } = useTelegramWebAppInstance();

  const getUserInfo = useCallback(() => {
    if (webApp?.initDataUnsafe?.user) {
      return webApp.initDataUnsafe.user;
    }
    return null;
  }, [webApp]);

  return {
    getUserInfo
  };
};
