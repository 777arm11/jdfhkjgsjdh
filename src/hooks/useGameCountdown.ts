
import { useState, useEffect, useCallback } from 'react';

export const useGameCountdown = (isPlaying: boolean, onCountdownComplete: () => void) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  const startCountdown = useCallback(() => {
    if (isPlaying) {
      setCountdown(3);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      startCountdown();
    } else {
      setCountdown(null);
    }
  }, [isPlaying, startCountdown]);

  useEffect(() => {
    if (countdown === null || !isPlaying) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          if (prev === 1) {
            onCountdownComplete();
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [countdown, isPlaying, onCountdownComplete]);

  return countdown;
};
