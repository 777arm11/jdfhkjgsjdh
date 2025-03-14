
import { useCallback, useState } from 'react';
import { useTelegramWebAppInstance } from '@/hooks/useTelegramWebAppInstance';

export const useTelegramBackButton = () => {
  const { webApp } = useTelegramWebAppInstance();
  const [backButtonVisible, setBackButtonVisible] = useState(false);

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

  return {
    backButtonVisible,
    showBackButton,
    hideBackButton,
    onBackButtonClick,
    offBackButtonClick
  };
};
