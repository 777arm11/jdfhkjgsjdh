
import { useTelegramWebAppInstance } from '@/hooks/useTelegramWebAppInstance';
import { useTelegramNotifications } from '@/hooks/useTelegramNotifications';
import { useTelegramBackButton } from '@/hooks/useTelegramBackButton';
import { useTelegramUser } from '@/hooks/useTelegramUser';

export const useTelegramWebApp = () => {
  const { isWebAppAvailable, colorScheme, themeParams } = useTelegramWebAppInstance();
  const { hapticFeedback, showSuccess, showError, showPopup } = useTelegramNotifications();
  const { backButtonVisible, showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick } = useTelegramBackButton();
  const { getUserInfo } = useTelegramUser();

  return {
    // Core WebApp info
    isWebAppAvailable,
    colorScheme,
    themeParams,
    
    // Notifications and feedback
    hapticFeedback,
    showSuccess,
    showError,
    showPopup,
    
    // Back button
    backButtonVisible,
    showBackButton,
    hideBackButton,
    onBackButtonClick,
    offBackButtonClick,
    
    // User info
    getUserInfo,
  };
};
