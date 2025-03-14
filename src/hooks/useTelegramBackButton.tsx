
import { useCallback, useEffect, useState } from 'react';
import { useTelegramWebAppInstance } from '@/hooks/useTelegramWebAppInstance';

export const useTelegramBackButton = () => {
  const { webApp } = useTelegramWebAppInstance();
  const [backButtonVisible, setBackButtonVisible] = useState(false);

  const showBackButton = useCallback(() => {
    if (webApp?.BackButton) {
      webApp.BackButton.show();
      setBackButtonVisible(true);
    }
  }, [webApp]);

  const hideBackButton = useCallback(() => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide();
      setBackButtonVisible(false);
    }
  }, [webApp]);

  const onBackButtonClick = useCallback(
    (cb: () => void) => {
      webApp?.BackButton?.onClick(cb);
    },
    [webApp]
  );

  const offBackButtonClick = useCallback(
    (cb: () => void) => {
      webApp?.BackButton?.offClick(cb);
    },
    [webApp]
  );

  useEffect(() => {
    return () => {
      if (backButtonVisible && webApp?.BackButton) {
        webApp.BackButton.hide();
      }
    };
  }, [backButtonVisible, webApp]);

  return {
    backButtonVisible,
    showBackButton,
    hideBackButton,
    onBackButtonClick,
    offBackButtonClick,
  };
};
