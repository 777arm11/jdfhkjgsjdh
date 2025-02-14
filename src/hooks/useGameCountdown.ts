
import { useState, useEffect } from 'react';

export const useGameCountdown = (isPlaying: boolean, onCountdownComplete: () => void) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isPlaying) {
      setCountdown(3);
      
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            if (timer) clearInterval(timer);
            if (prev === 1) {
              onCountdownComplete();
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(null);
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, onCountdownComplete]);

  return countdown;
};
