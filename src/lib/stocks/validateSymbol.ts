/**
 * 주식 라우트가 받는 심볼의 형식 검증.
 * URL 경로·쿼리의 심볼이 Yahoo/Naver/Django 경로에 그대로 들어가므로, 허용 문자 집합을 좁혀 경로 주입(`../`)을 막는다.
 */

/** Yahoo 형식: `005930.KS`, `AAPL`, `BRK-B`, `CL=F`, `USDKRW=X`, `^GSPC`, `^KS200`, `BTC-USD` */
const YAHOO_SYMBOL = /^\^?[A-Z0-9]{1,10}([.\-=][A-Z0-9]{1,4})?$/;

/** KRX 종목코드 6자리 (KIS 라우트) */
const KRX_CODE = /^\d{6}$/;

export function isValidYahooSymbol(symbol: string | null | undefined): symbol is string {
  return typeof symbol === 'string' && symbol.length <= 16 && YAHOO_SYMBOL.test(symbol);
}

export function isValidKrxCode(code: string | null | undefined): code is string {
  return typeof code === 'string' && KRX_CODE.test(code);
}
