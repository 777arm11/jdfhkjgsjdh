
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTelegramWebAppInstance } from '@/hooks/useTelegramWebAppInstance';

export const useTelegramNotifications = () => {
  const { webApp } = useTelegramWebAppInstance();
  const { toast } = useToast();

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

  return {
    hapticFeedback,
    showSuccess,
    showError,
    showPopup
  };
};
