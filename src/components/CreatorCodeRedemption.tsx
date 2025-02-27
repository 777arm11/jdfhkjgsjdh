
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gift, AlertCircle, Loader2 } from 'lucide-react';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import { supabase } from '@/integrations/supabase/client';
import { usePlayerData } from '@/hooks/usePlayerData';
import { useToast } from '@/hooks/use-toast';

const CreatorCodeRedemption = () => {
  const [creatorCode, setCreatorCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { hapticFeedback, showSuccess, showError } = useTelegramWebApp();
  const { playerData, refreshPlayerData } = usePlayerData();
  const { toast } = useToast();
  const telegramWebApp = window.Telegram?.WebApp;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!creatorCode.trim()) {
      hapticFeedback('medium');
      showError('Please enter a creator code');
      return;
    }

    // If Telegram WebApp is available, show the main button
    if (telegramWebApp?.MainButton) {
      telegramWebApp.MainButton.setText('Processing...');
      telegramWebApp.MainButton.show();
      telegramWebApp.MainButton.disable();
    }

    setIsSubmitting(true);
    hapticFeedback('medium');

    try {
      const { data, error } = await supabase.rpc('redeem_creator_code', {
        code: creatorCode.trim(),
        p_player_id: playerData?.id
      });

      if (error) {
        throw new Error(error.message || 'Failed to redeem code');
      }

      if (data.success) {
        setIsSuccess(true);
        hapticFeedback('heavy');
        showSuccess(`Successfully redeemed code: ${data.coins_added} coins added!`);
        refreshPlayerData();
        
        // Show success animation with Telegram WebApp
        if (telegramWebApp?.HapticFeedback) {
          telegramWebApp.HapticFeedback.notificationOccurred('success');
        }
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
          setCreatorCode('');
        }, 3000);
      } else {
        throw new Error(data.message || 'Invalid code');
      }
    } catch (error) {
      console.error('Error redeeming code:', error);
      hapticFeedback('error');
      showError(error.message || 'Failed to redeem code');
    } finally {
      setIsSubmitting(false);
      
      // Hide the main button
      if (telegramWebApp?.MainButton) {
        telegramWebApp.MainButton.hide();
      }
    }
  };

  // Support Telegram WebApp button
  React.useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    
    if (webApp?.MainButton) {
      // Configure main button
      const mainButton = webApp.MainButton;
      mainButton.setText('Redeem Code');
      mainButton.onClick(() => {
        if (creatorCode.trim()) {
          handleSubmit(new Event('submit') as any);
        } else {
          hapticFeedback('medium');
          showError('Please enter a creator code');
        }
      });
      
      // Show/hide button based on code presence
      if (creatorCode.trim()) {
        mainButton.show();
      } else {
        mainButton.hide();
      }
      
      return () => {
        mainButton.offClick(handleSubmit);
        mainButton.hide();
      };
    }
  }, [creatorCode, hapticFeedback, showError]);

  return (
    <Card className="bg-game-secondary border-game-accent shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-pixel flex items-center gap-2">
          <Gift className="h-5 w-5 text-purple-400" />
          Creator Code
        </CardTitle>
        <CardDescription>
          Enter a creator code to receive bonus coins
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              value={creatorCode}
              onChange={(e) => setCreatorCode(e.target.value)}
              placeholder="Enter code (e.g. CREATOR123)"
              className="bg-game-primary border-game-accent text-white font-pixel"
              disabled={isSubmitting || isSuccess}
            />
            {isSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded">
                <Check className="h-6 w-6 text-green-500" />
              </div>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full font-pixel bg-game-accent hover:bg-game-accent/80"
            disabled={isSubmitting || isSuccess || !creatorCode.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : isSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Redeemed!
              </>
            ) : (
              'Redeem Code'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-game-text/70 italic">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>Creator codes can only be redeemed once per player. Follow your favorite creators to get their codes!</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CreatorCodeRedemption;
