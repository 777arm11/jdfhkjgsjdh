import { useState, useEffect, useRef } from 'react';

export const useGameCountdown = (isPlaying: boolean, onCountdownComplete: () => void) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const cleanupTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    cleanupTimer();

    if (isPlaying) {
      setCountdown(3);

      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (!isPlayingRef.current || !prev || prev <= 1) {
            cleanupTimer();
            if (prev === 1 && isPlayingRef.current) {
              onCountdownComplete();
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(null);
    }

    return cleanupTimer;
  }, [isPlaying, onCountdownComplete]);

  return countdown;
};
