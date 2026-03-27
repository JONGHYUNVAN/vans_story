/**
 * useStocksData 훅의 isMarketOpen() 순수 로직 단위 테스트
 *
 * isMarketOpen은 useStocksData.ts 내부 비공개 함수이므로,
 * 동일 로직을 여기서 재구현하여 독립적으로 검증합니다.
 *
 * KST = UTC+9 이므로 vi.setSystemTime에는 UTC 기준 Date를 전달합니다.
 * 예: KST 09:00 → UTC 00:00 (동일 날짜), KST 15:30 → UTC 06:30
 * 모든 날짜는 'Z' 접미사가 붙은 UTC ISO-8601 문자열로 지정합니다.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

// -------------------------------------------------------
// 테스트 대상 로직 재구현 (useStocksData.ts 내부 isMarketOpen과 동일)
// -------------------------------------------------------
function isMarketOpen(): boolean {
  const now = new Date();
  const kstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  const day = kstNow.getDay(); // 0=일, 6=토
  const hour = kstNow.getHours();
  const min = kstNow.getMinutes();
  const time = hour * 60 + min;
  return day >= 1 && day <= 5 && time >= 9 * 60 && time < 15 * 60 + 30;
}

afterEach(() => {
  vi.useRealTimers();
});

describe('isMarketOpen 순수 로직', () => {
  // ----------------------------------------------------------
  // 1. 평일 장중 시간 → true
  // ----------------------------------------------------------
  it('평일(월) 09:00 KST → 장 오픈 (true)', () => {
    vi.useFakeTimers();
    // 2024-01-15는 월요일. KST 09:00 = UTC 00:00
    vi.setSystemTime(new Date('2024-01-15T00:00:00Z'));
    expect(isMarketOpen()).toBe(true);
  });

  it('평일(수) 12:00 KST → 장 오픈 (true)', () => {
    vi.useFakeTimers();
    // 2024-01-17는 수요일. KST 12:00 = UTC 03:00
    vi.setSystemTime(new Date('2024-01-17T03:00:00Z'));
    expect(isMarketOpen()).toBe(true);
  });

  it('평일(금) 15:29 KST → 장 오픈 (true)', () => {
    vi.useFakeTimers();
    // 2024-01-19는 금요일. KST 15:29 = UTC 06:29
    vi.setSystemTime(new Date('2024-01-19T06:29:00Z'));
    expect(isMarketOpen()).toBe(true);
  });

  // ----------------------------------------------------------
  // 2. 주말 → false
  // ----------------------------------------------------------
  it('토요일 11:00 KST → 장 닫힘 (false)', () => {
    vi.useFakeTimers();
    // 2024-01-20는 토요일. KST 11:00 = UTC 02:00
    vi.setSystemTime(new Date('2024-01-20T02:00:00Z'));
    expect(isMarketOpen()).toBe(false);
  });

  it('일요일 11:00 KST → 장 닫힘 (false)', () => {
    vi.useFakeTimers();
    // 2024-01-21는 일요일. KST 11:00 = UTC 02:00
    vi.setSystemTime(new Date('2024-01-21T02:00:00Z'));
    expect(isMarketOpen()).toBe(false);
  });

  // ----------------------------------------------------------
  // 3. 평일 장 마감 이후 → false
  // ----------------------------------------------------------
  it('평일(화) 15:30 KST → 장 닫힘 (false, 경계값 15:30은 포함되지 않음)', () => {
    vi.useFakeTimers();
    // 2024-01-16는 화요일. KST 15:30 = UTC 06:30
    vi.setSystemTime(new Date('2024-01-16T06:30:00Z'));
    expect(isMarketOpen()).toBe(false);
  });

  it('평일(목) 15:31 KST → 장 닫힘 (false)', () => {
    vi.useFakeTimers();
    // 2024-01-18는 목요일. KST 15:31 = UTC 06:31
    vi.setSystemTime(new Date('2024-01-18T06:31:00Z'));
    expect(isMarketOpen()).toBe(false);
  });

  it('평일(월) 18:00 KST → 장 닫힘 (false)', () => {
    vi.useFakeTimers();
    // KST 18:00 = UTC 09:00
    vi.setSystemTime(new Date('2024-01-15T09:00:00Z'));
    expect(isMarketOpen()).toBe(false);
  });

  // ----------------------------------------------------------
  // 4. 평일 장 시작 이전 → false
  // ----------------------------------------------------------
  it('평일(월) 08:59 KST → 장 닫힘 (false)', () => {
    vi.useFakeTimers();
    // KST 08:59 = UTC 23:59 (전날인 2024-01-14)
    vi.setSystemTime(new Date('2024-01-14T23:59:00Z'));
    expect(isMarketOpen()).toBe(false);
  });

  it('평일(수) 00:00 KST → 장 닫힘 (false)', () => {
    vi.useFakeTimers();
    // KST 00:00 (수 자정) = UTC 전날(화) 15:00
    vi.setSystemTime(new Date('2024-01-16T15:00:00Z'));
    expect(isMarketOpen()).toBe(false);
  });
});
