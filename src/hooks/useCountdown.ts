import { useEffect, useState } from 'react';
import { getTimeUntilLock } from '../utils/time';

export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilLock());

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      const remaining = getTimeUntilLock();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft > 0]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { timeLeft, hours, minutes, seconds, isExpired: timeLeft <= 0 };
}
