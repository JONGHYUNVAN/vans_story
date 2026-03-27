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

export type MacroCategory = 'currency' | 'bond' | 'index';

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

export const MACRO_SYMBOLS = [
  { symbol: 'USDKRW=X', name: 'USD/KRW', displayName: '원/달러 환율', category: 'currency' as const },
  { symbol: '^TNX', name: 'US 10Y Treasury', displayName: '미국 10년 국채', category: 'bond' as const },
  { symbol: '^KS11', name: 'KOSPI', displayName: '코스피', category: 'index' as const },
  { symbol: '^KQ11', name: 'KOSDAQ', displayName: '코스닥', category: 'index' as const },
  { symbol: '^IXIC', name: 'NASDAQ', displayName: '나스닥', category: 'index' as const },
  { symbol: '^GSPC', name: 'S&P 500', displayName: 'S&P 500', category: 'index' as const },
  { symbol: '^SOX', name: 'SOX', displayName: '필라델피아 반도체', category: 'index' as const },
] as const;

export const DART_CORP_CODE_MAP: Record<string, string> = {
  '005930': '00126380',
  '000660': '00164779',
  '005380': '00164742',
};
