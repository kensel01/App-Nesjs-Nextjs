import { useCallback, useRef } from 'react';

/**
 * Custom hook to throttle a function call by delaying its execution
 * @param callback The function to throttle
 * @param delay The delay in milliseconds
 * @returns A throttled version of the callback
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastCall = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  );
} 