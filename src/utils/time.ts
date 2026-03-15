import { LOCK_TIME } from '../config/constants';

export function isLocked(testMode: boolean): boolean {
  if (testMode) return false;
  return new Date() >= LOCK_TIME;
}

export function getTimeUntilLock(): number {
  return Math.max(0, LOCK_TIME.getTime() - Date.now());
}
