import { useState, useCallback } from 'react';

export const useRateLimit = (maxAttempts: number, windowMs: number) => {
  const [attempts, setAttempts] = useState<number[]>([]);

  const canProceed = useCallback(() => {
    const now = Date.now();
    const recentAttempts = attempts.filter(t => now - t < windowMs);
    return recentAttempts.length < maxAttempts;
  }, [attempts, maxAttempts, windowMs]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    setAttempts(prev => [...prev.filter(t => now - t < windowMs), now]);
  }, [windowMs]);

  const getRemainingTime = useCallback(() => {
    if (canProceed()) return 0;
    const now = Date.now();
    const oldestAttempt = Math.min(...attempts);
    return Math.ceil((windowMs - (now - oldestAttempt)) / 1000);
  }, [attempts, canProceed, windowMs]);

  return { canProceed, recordAttempt, getRemainingTime };
};
