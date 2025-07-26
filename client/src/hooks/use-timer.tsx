import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  initialTime: number; // in seconds
  onComplete?: () => void;
  onTick?: (timeRemaining: number) => void;
}

export function useTimer({ initialTime, onComplete, onTick }: UseTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!isRunning && timeRemaining > 0) {
      setIsRunning(true);
    }
  }, [isRunning, timeRemaining]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(initialTime);
  }, [initialTime]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(0);
  }, []);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          onTick?.(newTime);
          
          if (newTime <= 0) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, onComplete, onTick]);

  // Update timer when initialTime changes
  useEffect(() => {
    if (!isRunning) {
      setTimeRemaining(initialTime);
    }
  }, [initialTime, isRunning]);

  const progress = initialTime > 0 ? ((initialTime - timeRemaining) / initialTime) * 100 : 0;

  return {
    timeRemaining,
    isRunning,
    progress,
    start,
    pause,
    reset,
    stop,
  };
}
