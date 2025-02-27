
import { useEffect, useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useTelegramWebApp = () => {
  const { toast } = useToast();
  const [isReady, setIsReady] = useState(false);
  const webApp = window.Telegram?.WebApp;

  useEffect(() => {
    if (webApp) {
      try {
        // Initialize WebApp
        webApp.ready();
        webApp.expand();
        
        // Setup simple event handling based on what's available
        console.log('Debug: Telegram WebApp initialized');
        
        setIsReady(true);
        console.log('Debug: Telegram WebApp ready and expanded');
      } catch (error) {
        console.error('Debug: Error initializing Telegram WebApp', error);
      }
    } else {
      console.log('Debug: Telegram WebApp not available');
    }
  }, [webApp]);

  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'error' | 'success' | 'warning') => {
    if (!webApp?.HapticFeedback) {
      console.log(`Debug: Haptic feedback not available`);
      return;
    }
    
    try {
      if (type === 'light' || type === 'medium' || type === 'heavy') {
        webApp.HapticFeedback.impactOccurred(type);
      } else if (type === 'error' || type === 'success' || type === 'warning') {
        webApp.HapticFeedback.notificationOccurred(type);
      }
      console.log(`Debug: Haptic feedback ${type}`);
    } catch (error) {
      console.error('Debug: Haptic feedback error', error);
    }
  }, [webApp]);

  const showMainButton = useCallback((text: string, onClick: () => void) => {
    if (!webApp?.MainButton) {
      console.log('Debug: Main button not available');
      return () => {};
    }
    
    try {
      webApp.MainButton.setText(text);
      webApp.MainButton.onClick(onClick);
      webApp.MainButton.show();
      
      return () => {
        webApp.MainButton.offClick(onClick);
        webApp.MainButton.hide();
      };
    } catch (error) {
      console.error('Debug: Main button error', error);
      return () => {};
    }
  }, [webApp]);

  // Simplified back button implementation - only use if available
  const showBackButton = useCallback((onClick: () => void) => {
    // Safety check - only use BackButton if it exists in the API
    const backButton = webApp && 'BackButton' in webApp ? (webApp as any).BackButton : null;
    
    if (!backButton) {
      console.log('Debug: Back button not available');
      return () => {};
    }
    
    try {
      if (typeof backButton.onClick === 'function') {
        backButton.onClick(onClick);
        backButton.show();
        
        return () => {
          if (typeof backButton.offClick === 'function') {
            backButton.offClick(onClick);
            backButton.hide();
          }
        };
      }
    } catch (error) {
      console.error('Debug: Back button error', error);
    }
    
    return () => {};
  }, [webApp]);

  const showPopup = useCallback((title: string, message: string, buttons: string[] = ['OK']) => {
    // Safety check - only use showPopup if it exists in the API
    const hasPopup = webApp && 'showPopup' in webApp;
    
    if (!hasPopup) {
      console.log('Debug: Native popup not available, using toast instead');
      toast({
        title,
        description: message,
      });
      return Promise.resolve({ button_id: 0 });
    }
    
    try {
      return (webApp as any).showPopup({ title, message, buttons });
    } catch (error) {
      console.error('Debug: Popup error', error);
      toast({
        title,
        description: message,
      });
      return Promise.resolve({ button_id: 0 });
    }
  }, [webApp, toast]);

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

  return {
    hapticFeedback,
    showSuccess,
    showError,
    showMainButton,
    showBackButton,
    showPopup,
    colorScheme: webApp?.colorScheme || 'light',
    themeParams: webApp?.themeParams,
    isWebAppAvailable: !!webApp,
    isReady,
    webApp,
  };
};
