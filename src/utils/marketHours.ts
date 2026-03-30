const WEEKDAY_TO_DOW: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function getKstDayAndMinutes(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const wd = parts.find((p) => p.type === 'weekday')?.value ?? 'Sun';
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10);
  return { day: WEEKDAY_TO_DOW[wd] ?? 0, minutes: hour * 60 + minute };
}

/** KRX 정규장 (평일 09:00~15:30 KST) */
export function isKrxRegularSession(): boolean {
  const { day, minutes } = getKstDayAndMinutes();
  return day >= 1 && day <= 5 && minutes >= 9 * 60 && minutes < 15 * 60 + 30;
}

/** KRX 확장 세션 — 동시호가 포함 (평일 08:30~16:00 KST) */
export function isKrxExtendedSession(): boolean {
  const { day, minutes } = getKstDayAndMinutes();
  return day >= 1 && day <= 5 && minutes >= 8 * 60 + 30 && minutes < 16 * 60;
}

export type MarketState = 'PRE' | 'REGULAR' | 'POST' | 'CLOSED';

function getEstDayAndMinutes(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const wd = parts.find((p) => p.type === 'weekday')?.value ?? 'Sun';
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10);
  return { day: WEEKDAY_TO_DOW[wd] ?? 0, minutes: hour * 60 + minute };
}

/** KR 시장 4가지 상태 (KST 기준) */
export function getKrMarketState(): MarketState {
  const { day, minutes } = getKstDayAndMinutes();
  if (day < 1 || day > 5) return 'CLOSED';
  if (minutes >= 8 * 60 && minutes < 9 * 60) return 'PRE';
  if (minutes >= 9 * 60 && minutes < 15 * 60 + 30) return 'REGULAR';
  if (minutes >= 15 * 60 + 30 && minutes < 16 * 60) return 'POST';
  return 'CLOSED';
}

/** US 시장 4가지 상태 (ET 기준) */
export function getUsMarketState(): MarketState {
  const { day, minutes } = getEstDayAndMinutes();
  if (day < 1 || day > 5) return 'CLOSED';
  if (minutes >= 4 * 60 && minutes < 9 * 60 + 30) return 'PRE';
  if (minutes >= 9 * 60 + 30 && minutes < 16 * 60) return 'REGULAR';
  if (minutes >= 16 * 60 && minutes < 20 * 60) return 'POST';
  return 'CLOSED';
}
