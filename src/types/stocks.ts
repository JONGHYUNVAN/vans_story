// ============================================================
// 공통 타입
// ============================================================

export type Market = 'kr' | 'us';

export type MarketState =
  | 'PRE'
  | 'REGULAR'
  | 'POST'
  | 'CLOSED'
  | 'PREPRE'
  | 'POSTPOST';

export type StocksApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string; details?: unknown } };

// ============================================================
// 주가 데이터
// ============================================================

export interface StockPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number | null;
  currency: string;
  market: Market;
  marketState: MarketState;
  updatedAt: number; // Unix timestamp
}

export interface StockPricesData {
  stocks: StockPrice[];
  fetchedAt: string;
}

// ============================================================
// 거시지표
// ============================================================

export type MacroCategory = 'currency' | 'bond' | 'index' | 'commodity';

export interface MacroIndicator {
  symbol: string;
  name: string;
  displayName: string;
  price: number;
  change: number;
  changePercent: number;
  category: MacroCategory;
}

export interface MacroData {
  currency: MacroIndicator[];
  bond: MacroIndicator[];
  index: MacroIndicator[];
  commodity: MacroIndicator[];
  fetchedAt: string;
}

// ============================================================
// 뉴스
// ============================================================

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}

export interface StockNewsData {
  symbol: string;
  news: NewsItem[];
  fetchedAt: string;
}

// ============================================================
// DART 공시
// ============================================================

export interface DartDisclosure {
  corpCode: string;
  corpName: string;
  stockCode: string;
  reportName: string;
  receiptNo: string;
  filerName: string;
  receiptDate: string;
  remark: string;
  detailUrl: string;
}

export interface DartData {
  disclosures: DartDisclosure[];
  fetchedAt: string;
}

// ============================================================
// Yahoo Finance API 내부 타입
// ============================================================

export interface YahooQuoteResult {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketPreviousClose: number;
  /** 전일 종가가 비어 있을 때 차트 기준 종가 (v7 응답에 포함되는 경우 있음) */
  chartPreviousClose?: number;
  regularMarketOpen: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  marketCap?: number;
  currency: string;
  exchange: string;
  marketState: string;
  regularMarketTime: number;
  quoteType: string;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
}

export interface YahooQuoteResponse {
  quoteResponse: {
    result: YahooQuoteResult[];
    error: string | null;
  };
}

export interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: {
        currency: string;
        symbol: string;
        exchangeName: string;
        fullExchangeName: string;
        regularMarketPrice: number;
        previousClose: number;
        chartPreviousClose: number;
        regularMarketTime: number;
        regularMarketDayHigh?: number;
        regularMarketDayLow?: number;
        regularMarketVolume?: number;
        regularMarketOpen?: number;
        fiftyTwoWeekHigh?: number;
        fiftyTwoWeekLow?: number;
        shortName?: string;
        longName?: string;
        marketState?: string;
        dataGranularity: string;
        range: string;
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          open: number[];
          high: number[];
          low: number[];
          close: number[];
          volume: number[];
        }>;
        adjclose?: Array<{ adjclose: number[] }>;
      };
    }>;
    error: string | null;
  };
}

export interface DartApiResponse {
  status: string;
  message: string;
  page_no: number;
  page_count: number;
  total_count: number;
  total_page: number;
  list: Array<{
    corp_code: string;
    corp_name: string;
    stock_code: string;
    corp_cls: string;
    report_nm: string;
    rcept_no: string;
    flr_nm: string;
    rcept_dt: string;
    rm: string;
  }>;
}

// ============================================================
// 상수
// ============================================================

export const KR_STOCKS = [
  { symbol: '005930.KS', name: '삼성전자', stockCode: '005930', dartCorpCode: '00126380' },
  { symbol: '000660.KS', name: 'SK하이닉스', stockCode: '000660', dartCorpCode: '00164779' },
  { symbol: '005380.KS', name: '현대차', stockCode: '005380', dartCorpCode: '00164742' },
] as const;

export const US_STOCKS = [
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'QCOM', name: 'Qualcomm' },
  { symbol: 'AMD', name: 'AMD' },
  { symbol: 'INTC', name: 'Intel' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'AVGO', name: 'Broadcom' },
] as const;

/** 대시보드에서 추적하는 심볼 → 표시용 종목명 (Yahoo 미수록·심볼 폴백 대비) */
export const STOCK_DISPLAY_NAME: Record<string, string> = Object.fromEntries([
  ...KR_STOCKS.map((s) => [s.symbol, s.name] as const),
  ...US_STOCKS.map((s) => [s.symbol, s.name] as const),
]);

export function resolveStockDisplayName(
  symbol: string,
  shortName?: string | null,
  longName?: string | null,
): string {
  if (STOCK_DISPLAY_NAME[symbol]) return STOCK_DISPLAY_NAME[symbol];
  const raw = (shortName || longName || '').trim();
  if (raw && raw !== symbol) return raw;
  return symbol;
}

export const MACRO_SYMBOLS = [
  { symbol: 'USDKRW=X', name: 'USD/KRW', displayName: '원/달러 환율', category: 'currency' as const },
  { symbol: '^TNX', name: 'US 10Y Treasury', displayName: '미국 10년 국채', category: 'bond' as const },
  { symbol: '^KS11', name: 'KOSPI', displayName: '코스피', category: 'index' as const },
  { symbol: '^KQ11', name: 'KOSDAQ', displayName: '코스닥', category: 'index' as const },
  { symbol: '^IXIC', name: 'NASDAQ', displayName: '나스닥', category: 'index' as const },
  { symbol: '^GSPC', name: 'S&P 500', displayName: 'S&P 500', category: 'index' as const },
  { symbol: '^SOX', name: 'SOX', displayName: '필라델피아 반도체', category: 'index' as const },
  { symbol: 'CL=F', name: 'WTI Crude Oil', displayName: 'WTI 유가', category: 'commodity' as const },
] as const;

export const DART_CORP_CODE_MAP: Record<string, string> = {
  '005930': '00126380',
  '000660': '00164779',
  '005380': '00164742',
};

// ============================================================
// KIS 실시간 데이터
// ============================================================

/** KIS 체결가 데이터 */
export interface KisTradeData {
  price: number;           // 현재가
  change: number;          // 전일대비
  changePercent: number;   // 전일대비율(%)
  changeSign: string;      // 대비부호 (1:상한,2:상승,3:보합,4:하한,5:하락)
  volume: number;          // 누적거래량
  amount: number;          // 누적거래대금
  open: number;            // 시가
  high: number;            // 고가
  low: number;             // 저가
  prevClose: number;       // 전일종가
  time: string;            // 체결시간 "HHMMSS"
}

/** KIS 호가 데이터 (10호가) */
export interface KisOrderbookData {
  askPrices: number[];     // 매도호가 1~10 (낮은가->높은가)
  askVolumes: number[];    // 매도호가 잔량 1~10
  bidPrices: number[];     // 매수호가 1~10 (높은가->낮은가)
  bidVolumes: number[];    // 매수호가 잔량 1~10
  totalAskVolume: number;  // 총 매도호가 잔량
  totalBidVolume: number;  // 총 매수호가 잔량
  time: string;            // 호가시간 "HHMMSS"
}

/** KIS 스냅샷 응답 */
export interface KisSnapshotData {
  symbol: string;          // 종목코드 6자리
  name: string;            // 종목명
  trade: KisTradeData;
  orderbook: KisOrderbookData;
  updatedAt: string;       // ISO 8601
}

// ============================================================
// 상세 페이지 데이터
// ============================================================

export interface ChartDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface InvestorTrend {
  date: string;
  foreign: number;
  foreignHoldRatio: number;
  institution: number;
  individual: number;
  volume: number;
  close: number;
}

export interface StockFundamentals {
  per: number | null;
  forwardPer: number | null;
  pbr: number | null;
  eps: number | null;
  bps: number | null;
  dividendYield: number | null;
  marketValueStr: string | null;
  tradingValueStr: string | null;
  foreignHoldRatio: number | null;
  week52High: number | null;
  week52Low: number | null;
}

export interface StockConsensus {
  targetPrice: number | null;       // 평균 목표주가
  targetHigh: number | null;        // 최고 목표주가
  targetLow: number | null;         // 최저 목표주가
  recommendation: number | null;    // 투자의견 점수 (1=강매도 ~ 5=강매수)
  recommendationKey: string | null; // 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'
  numberOfAnalysts: number | null;  // 참여 애널리스트 수
  sources: string[];                // 데이터 출처 목록
  /** 최근 애널리스트 리포트 목록 (증권사명 + 날짜 + 개별 목표주가) */
  analystReports?: Array<{ broker: string; date: string; title: string; targetPrice?: number | null }>;
}

export interface StockPeer {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface StockDetailData {
  symbol: string;
  name: string;
  quote: {
    price: number;
    change: number;
    changePercent: number;
    previousClose: number;
    open: number;
    high: number;
    low: number;
    volume: number;
    marketCap: number | null;
    currency: string;
    marketState: MarketState;
    fiftyTwoWeekHigh: number | null;
    fiftyTwoWeekLow: number | null;
  };
  chart: ChartDataPoint[];
  type: 'kr' | 'us' | 'macro';
  fundamentals: StockFundamentals | null;
  investors: InvestorTrend[] | null;
  /** 소스별 컨센서스 목록 (Naver, Yahoo 등) */
  consensusBySource: StockConsensus[];
  /** 하위 호환용: consensusBySource 의 합산평균 (없으면 null) */
  consensus: StockConsensus | null;
  peers: StockPeer[] | null;
  fetchedAt: string;
}
