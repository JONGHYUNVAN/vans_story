import { describe, it, expect } from 'vitest';
import { isValidKrxCode, isValidYahooSymbol } from '../validateSymbol';

describe('isValidYahooSymbol', () => {
  it.each([
    '005930.KS',
    '000660.KQ',
    'AAPL',
    'BRK-B',
    'CL=F',
    'KK=F',
    'USDKRW=X',
    '^GSPC',
    '^KS200',
    '^TNX',
    'BTC-USD',
  ])('허용: %s', (s) => {
    expect(isValidYahooSymbol(s)).toBe(true);
  });

  it.each(['../../admin', '005930/KS', 'aapl', 'AAPL AAPL', '', '^', 'A'.repeat(20), 'AAPL?x=1'])(
    '거부: %s',
    (s) => {
      expect(isValidYahooSymbol(s)).toBe(false);
    },
  );

  it('null/undefined는 거부', () => {
    expect(isValidYahooSymbol(null)).toBe(false);
    expect(isValidYahooSymbol(undefined)).toBe(false);
  });
});

describe('isValidKrxCode', () => {
  it('숫자 6자리만 허용', () => {
    expect(isValidKrxCode('005930')).toBe(true);
    expect(isValidKrxCode('005930.KS')).toBe(false);
    expect(isValidKrxCode('..%2F')).toBe(false);
    expect(isValidKrxCode('../../admin')).toBe(false);
    expect(isValidKrxCode('12345')).toBe(false);
  });
});
