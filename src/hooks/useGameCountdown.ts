
import { useState, useEffect, useRef } from 'react';

export const useGameCountdown = (isPlaying: boolean, onCountdownComplete: () => void) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer immediately
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isPlaying) {
      setCountdown(3);
      
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            if (prev === 1) {
              onCountdownComplete();
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Immediate cleanup on game reset
      setCountdown(null);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, onCountdownComplete]);

  return countdown;
};
