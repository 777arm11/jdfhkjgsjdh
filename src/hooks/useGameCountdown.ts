import { useState, useEffect } from 'react';

export const useGameCountdown = (isPlaying: boolean, onCountdownComplete: () => void) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      setCountdown(3);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            if (prev === 1) {
              onCountdownComplete();
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
      };
    } else {
      setCountdown(null);
    }
  }, [isPlaying, onCountdownComplete]);

  return countdown;
};