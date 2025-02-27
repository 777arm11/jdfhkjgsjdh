
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
        
        // Setup event listeners using addEventListener if supported
        // Not all Telegram clients support this, so we'll use a try/catch
        try {
          const handleViewportChanged = () => {
            console.log('Debug: Telegram WebApp viewport changed');
          };
          
          const handleMainButtonClicked = () => {
            console.log('Debug: Telegram WebApp main button clicked');
          };
          
          const handleBackButtonClicked = () => {
            console.log('Debug: Telegram WebApp back button clicked');
          };
          
          // Add event listeners if they exist
          if (typeof webApp.addEventListener === 'function') {
            webApp.addEventListener('viewportChanged', handleViewportChanged);
            webApp.addEventListener('mainButtonClicked', handleMainButtonClicked);
            webApp.addEventListener('backButtonClicked', handleBackButtonClicked);
            
            // Return cleanup function
            return () => {
              webApp.removeEventListener('viewportChanged', handleViewportChanged);
              webApp.removeEventListener('mainButtonClicked', handleMainButtonClicked);
              webApp.removeEventListener('backButtonClicked', handleBackButtonClicked);
            };
          }
        } catch (e) {
          console.log('Debug: Event listeners not supported in this Telegram client');
        }
        
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

  // Simplified back button implementation since it's not supported in all clients
  const showBackButton = useCallback((onClick: () => void) => {
    if (!webApp || !webApp.BackButton) {
      console.log('Debug: Back button not available');
      return () => {};
    }
    
    try {
      // Make sure BackButton exists
      if (typeof webApp.BackButton?.onClick === 'function') {
        webApp.BackButton.onClick(onClick);
        webApp.BackButton.show();
        
        return () => {
          if (typeof webApp.BackButton?.offClick === 'function') {
            webApp.BackButton.offClick(onClick);
            webApp.BackButton.hide();
          }
        };
      }
    } catch (error) {
      console.error('Debug: Back button error', error);
    }
    
    return () => {};
  }, [webApp]);

  const showPopup = useCallback((title: string, message: string, buttons: string[] = ['OK']) => {
    if (!webApp) {
      console.log('Debug: Popup not available');
      toast({
        title,
        description: message,
      });
      return Promise.resolve({ button_id: 0 });
    }
    
    try {
      // Check if showPopup method exists
      if (typeof webApp.showPopup === 'function') {
        return webApp.showPopup({ title, message, buttons });
      } else {
        console.log('Debug: Native popup not available, using toast instead');
        toast({
          title,
          description: message,
        });
        return Promise.resolve({ button_id: 0 });
      }
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
