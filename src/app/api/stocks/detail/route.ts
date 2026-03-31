import { NextRequest, NextResponse } from 'next/server';
import type {
  StockDetailData,
  ChartDataPoint,
  StocksApiResponse,
  YahooChartResponse,
  MarketState,
  StockFundamentals,
  InvestorTrend,
  StockConsensus,
  StockPeer,
} from '@/types/stocks';
import { KR_STOCKS, US_STOCKS, MACRO_SYMBOLS, resolveStockDisplayName } from '@/types/stocks';
import { getSymbolType } from '@/utils/stockSymbol';

const YAHOO_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
};

const NAVER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
  Referer: 'https://m.stock.naver.com/',
};

function finiteNum(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** "+1,234,567" / "-1,234" → number */
function parseNaverNum(s: string | undefined | null): number {
  if (!s) return 0;
  return parseInt(s.replace(/[^-\d]/g, ''), 10) || 0;
}

/** "48.73%" → 48.73 */
function parseNaverPct(s: string | undefined | null): number {
  if (!s) return 0;
  return parseFloat(s.replace('%', '')) || 0;
}

/** "27.38배" / "2.81배" → 27.38 */
function parseNaverMultiple(s: string | undefined | null): number | null {
  if (!s || s === 'N/A' || s === '-') return null;
  const n = parseFloat(s.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

/** "6,564원" / "24,478원" → number */
function parseNaverKrw(s: string | undefined | null): number | null {
  if (!s || s === 'N/A' || s === '-') return null;
  const n = parseInt(s.replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function krxCode(symbol: string): string {
  return symbol.replace(/\.(KS|KQ)$/, '');
}

interface NaverIntegration {
  totalInfos?: Array<{ code: string; key: string; value: string }>;
  dealTrendInfos?: Array<{
    bizdate: string;
    foreignerPureBuyQuant: string;
    foreignerHoldRatio: string;
    organPureBuyQuant: string;
    individualPureBuyQuant: string;
    accumulatedTradingVolume: string;
    closePrice: string;
  }>;
  consensusInfo?: { priceTargetMean?: string; recommMean?: string } | null;
  researches?: Array<{
    id: number;
    cd: string;
    nm: string;
    bnm: string;    // 증권사명
    tit: string;    // 리포트 제목
    rcnt: string;
    wdt: string;    // YYYYMMDD
  }> | null;
  industryCompareInfo?: Array<{
    itemCode: string;
    stockName: string;
    closePrice: string;
    compareToPreviousClosePrice: string;
    fluctuationsRatio: string;
  }> | null;
}

/** 네이버 컨센서스 상세 (별도 엔드포인트) */
interface NaverConsensusDetail {
  priceTarget?: {
    high?: string;
    low?: string;
    mean?: string;
    median?: string;
    count?: number | string;
  } | null;
  recomm?: {
    strongBuy?: number | string;
    buy?: number | string;
    hold?: number | string;
    sell?: number | string;
    strongSell?: number | string;
    total?: number | string;
  } | null;
  // integration에서 넘어오는 형태도 허용
  [key: string]: unknown;
}

async function fetchNaverIntegration(
  symbol: string,
): Promise<NaverIntegration | null> {
  const code = krxCode(symbol);
  const url = `https://m.stock.naver.com/api/stock/${code}/integration`;
  try {
    const res = await fetch(url, { headers: NAVER_HEADERS, cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as NaverIntegration;
  } catch {
    return null;
  }
}

interface NaverResearchDetail {
  researchContent?: {
    itemCode?: string;
    brokerName?: string;
    writeDate?: string;
    opinion?: string;     // '매수' | '중립' | '매도' etc.
    goalPrice?: string;   // 목표주가 (숫자 문자열, e.g. "300000")
    prevGoalPrice?: string;
  };
}

/** 개별 리포트 목표주가 병렬 조회 */
async function fetchNaverResearchGoalPrices(
  researches: Array<{ id: number; bnm: string; tit: string; wdt: string }>,
): Promise<Array<{ id: number; goalPrice: number | null; opinion: string | null }>> {
  const results = await Promise.allSettled(
    researches.map(async (r) => {
      const url = `https://m.stock.naver.com/api/research/company/${r.id}`;
      try {
        const res = await fetch(url, { headers: NAVER_HEADERS, cache: 'no-store' });
        if (!res.ok) return { id: r.id, goalPrice: null, opinion: null };
        const json: NaverResearchDetail = await res.json();
        const rc = json.researchContent;
        const gp = parseInt(rc?.goalPrice ?? '', 10);
        return {
          id: r.id,
          goalPrice: Number.isFinite(gp) && gp > 0 ? gp : null,
          opinion: rc?.opinion ?? null,
        };
      } catch {
        return { id: r.id, goalPrice: null, opinion: null };
      }
    }),
  );
  return results.map((r) =>
    r.status === 'fulfilled' ? r.value : { id: 0, goalPrice: null, opinion: null },
  );
}

/** 네이버 상세 컨센서스 (목표가 범위, 애널리스트 수) */
async function fetchNaverConsensusDetail(
  symbol: string,
): Promise<NaverConsensusDetail | null> {
  const code = krxCode(symbol);
  // 네이버 증권 컨센서스 엔드포인트 순서대로 시도
  const urls = [
    `https://m.stock.naver.com/api/stock/${code}/consensus`,
    `https://m.stock.naver.com/api/stock/${code}/consensusInfo`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: NAVER_HEADERS, cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json && typeof json === 'object') return json as NaverConsensusDetail;
      }
    } catch {
      // 다음 URL 시도
    }
  }
  return null;
}

/** Yahoo Finance v11 quoteSummary — US 주가 컨센서스 */
async function fetchYahooConsensus(symbol: string): Promise<StockConsensus | null> {
  // query2 가 query1 보다 덜 엄격한 경우가 있음
  const hosts = ['query2.finance.yahoo.com', 'query1.finance.yahoo.com'];
  for (const host of hosts) {
    const url =
      `https://${host}/v11/finance/quoteSummary/${encodeURIComponent(symbol)}` +
      `?modules=financialData,recommendationTrend`;
    try {
      const res = await fetch(url, { headers: YAHOO_HEADERS, cache: 'no-store' });
      if (!res.ok) continue;
      const json = await res.json();
      const result = json?.quoteSummary?.result?.[0];
      if (!result) continue;

      const fd  = result.financialData;
      const rt  = result.recommendationTrend?.trend?.[0]; // 최신 기간

      const targetMean   = fd?.targetMeanPrice?.raw   ?? null;
      const targetHigh   = fd?.targetHighPrice?.raw   ?? null;
      const targetLow    = fd?.targetLowPrice?.raw    ?? null;
      const recommMean   = fd?.recommendationMean?.raw ?? null;
      const recommKey    = fd?.recommendationKey       ?? null;
      const numAnalysts  = fd?.numberOfAnalystOpinions?.raw ?? null;

      // recommendationTrend로 보강 (strongBuy+buy+hold+sell+strongSell 합계)
      const trendTotal =
        rt
          ? (rt.strongBuy ?? 0) + (rt.buy ?? 0) + (rt.hold ?? 0) +
            (rt.sell ?? 0) + (rt.strongSell ?? 0)
          : null;
      const analystCount =
        numAnalysts !== null ? numAnalysts : trendTotal !== null && trendTotal > 0 ? trendTotal : null;

      if (targetMean !== null || recommMean !== null) {
        return {
          targetPrice: targetMean,
          targetHigh,
          targetLow,
          recommendation: recommMean,
          recommendationKey: recommKey,
          numberOfAnalysts: analystCount,
          sources: ['Yahoo Finance'],
        };
      }
    } catch {
      // 다음 host 시도
    }
  }
  return null;
}

function parseNaverFundamentals(
  naver: NaverIntegration,
): StockFundamentals {
  const infoMap = new Map<string, string>(
    (naver.totalInfos ?? []).map((t) => [t.code, t.value]),
  );

  const get = (code: string) => infoMap.get(code);

  return {
    per: parseNaverMultiple(get('per')),
    forwardPer: parseNaverMultiple(get('cnsPer')),
    pbr: parseNaverMultiple(get('pbr')),
    eps: parseNaverKrw(get('eps')),
    bps: parseNaverKrw(get('bps')),
    dividendYield: (() => {
      const v = get('dividendYieldRatio');
      if (!v) return null;
      const n = parseFloat(v.replace('%', ''));
      return Number.isFinite(n) ? n : null;
    })(),
    marketValueStr: get('marketValue') ?? null,
    tradingValueStr: get('accumulatedTradingValue') ?? null,
    foreignHoldRatio: (() => {
      const v = get('foreignRate');
      if (!v) return null;
      const n = parseFloat(v.replace('%', ''));
      return Number.isFinite(n) ? n : null;
    })(),
    week52High: (() => {
      const v = get('highPriceOf52Weeks');
      if (!v) return null;
      const n = parseInt(v.replace(/,/g, ''), 10);
      return Number.isFinite(n) ? n : null;
    })(),
    week52Low: (() => {
      const v = get('lowPriceOf52Weeks');
      if (!v) return null;
      const n = parseInt(v.replace(/,/g, ''), 10);
      return Number.isFinite(n) ? n : null;
    })(),
  };
}

function parseNaverInvestors(naver: NaverIntegration): InvestorTrend[] {
  return (naver.dealTrendInfos ?? []).map((d) => ({
    date: d.bizdate,
    foreign: parseNaverNum(d.foreignerPureBuyQuant),
    foreignHoldRatio: parseNaverPct(d.foreignerHoldRatio),
    institution: parseNaverNum(d.organPureBuyQuant),
    individual: parseNaverNum(d.individualPureBuyQuant),
    volume: parseNaverNum(d.accumulatedTradingVolume),
    close: parseNaverNum(d.closePrice),
  }));
}

function parseNaverConsensus(
  naver: NaverIntegration,
  detail: NaverConsensusDetail | null,
  researchPrices?: Array<{ id: number; goalPrice: number | null; opinion: string | null }>,
): StockConsensus | null {
  // 기본 값: integration의 consensusInfo
  const ci  = naver.consensusInfo;
  const tp  = parseFloat((ci?.priceTargetMean ?? '').replace(/,/g, ''));
  const rc  = parseFloat(ci?.recommMean ?? '');

  const targetMean = Number.isFinite(tp) ? tp : null;
  const recommMean = Number.isFinite(rc) ? rc : null;

  if (targetMean === null && recommMean === null) return null;

  // 상세 컨센서스 엔드포인트에서 범위·수 보강
  let targetHigh: number | null = null;
  let targetLow: number | null  = null;
  let numAnalysts: number | null = null;

  if (detail) {
    const pt = detail.priceTarget;
    if (pt) {
      const h = parseFloat(String(pt.high  ?? '').replace(/,/g, ''));
      const l = parseFloat(String(pt.low   ?? '').replace(/,/g, ''));
      const cnt = parseInt(String(pt.count ?? ''), 10);
      if (Number.isFinite(h) && h > 0) targetHigh = h;
      if (Number.isFinite(l) && l > 0) targetLow  = l;
      if (Number.isFinite(cnt) && cnt > 0) numAnalysts = cnt;
    }
    if (numAnalysts === null && detail.recomm) {
      const r = detail.recomm;
      const total = parseInt(String(r.total ?? ''), 10);
      if (Number.isFinite(total) && total > 0) {
        numAnalysts = total;
      } else {
        const s = [r.strongBuy, r.buy, r.hold, r.sell, r.strongSell]
          .map((v) => parseInt(String(v ?? '0'), 10))
          .reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
        if (s > 0) numAnalysts = s;
      }
    }
  }

  // 개별 리포트 목표주가 매핑
  const priceMap = new Map<number, { goalPrice: number | null; opinion: string | null }>(
    (researchPrices ?? []).map((p) => [p.id, p]),
  );

  return {
    targetPrice:       targetMean,
    targetHigh,
    targetLow,
    recommendation:    recommMean,
    recommendationKey: null,
    numberOfAnalysts:  numAnalysts,
    sources:           ['NAVER 증권'],
    analystReports:    (naver.researches ?? []).slice(0, 6).map((r) => ({
      broker:      r.bnm,
      date:        r.wdt.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3'),
      title:       r.tit,
      targetPrice: priceMap.get(r.id)?.goalPrice ?? null,
    })),
  };
}

function parseNaverPeers(naver: NaverIntegration): StockPeer[] {
  return (naver.industryCompareInfo ?? [])
    .slice(0, 5)
    .map((p) => {
      const price = parseInt(p.closePrice.replace(/,/g, ''), 10) || 0;
      const change = parseInt(p.compareToPreviousClosePrice.replace(/,/g, ''), 10) || 0;
      const pct = parseFloat(p.fluctuationsRatio) || 0;
      return {
        symbol: p.itemCode + '.KS',
        name: p.stockName,
        price,
        change,
        changePercent: pct,
      };
    });
}

function resolveName(symbol: string, shortName?: string, longName?: string): string {
  const kr = KR_STOCKS.find((s) => s.symbol === symbol);
  if (kr) return kr.name;
  const us = US_STOCKS.find((s) => s.symbol === symbol);
  if (us) return us.name;
  const macro = MACRO_SYMBOLS.find((m) => m.symbol === symbol);
  if (macro) return macro.displayName;
  return resolveStockDisplayName(symbol, shortName, longName);
}

async function fetchV8Detail(
  symbol: string,
): Promise<{ quote: StockDetailData['quote']; chart: ChartDataPoint[]; name: string }> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1mo`;
  const res = await fetch(url, { headers: YAHOO_HEADERS, cache: 'no-store' });
  if (!res.ok) throw new Error(`Yahoo Finance v8 오류: ${res.status}`);

  const json: YahooChartResponse = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error('v8 결과 없음');

  const meta = result.meta;
  const timestamps = result.timestamp ?? [];
  const rawQuote = result.indicators?.quote?.[0];

  const price = finiteNum(meta.regularMarketPrice);
  const prevRaw = finiteNum(meta.previousClose);
  const chartPrev = finiteNum(meta.chartPreviousClose);
  const previousClose = prevRaw > 0 ? prevRaw : chartPrev > 0 ? chartPrev : 0;

  const change = previousClose !== 0 ? price - previousClose : 0;
  const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

  const lastIdx = (rawQuote?.close?.length ?? 0) - 1;
  const lastClose = lastIdx >= 0 ? finiteNum(rawQuote?.close?.[lastIdx], price) : price;

  const high =
    finiteNum(meta.regularMarketDayHigh) > 0
      ? finiteNum(meta.regularMarketDayHigh)
      : lastIdx >= 0
        ? finiteNum(rawQuote?.high?.[lastIdx], lastClose)
        : lastClose;
  const low =
    finiteNum(meta.regularMarketDayLow) > 0
      ? finiteNum(meta.regularMarketDayLow)
      : lastIdx >= 0
        ? finiteNum(rawQuote?.low?.[lastIdx], lastClose)
        : lastClose;
  const open =
    finiteNum(meta.regularMarketOpen) > 0
      ? finiteNum(meta.regularMarketOpen)
      : lastIdx >= 0
        ? finiteNum(rawQuote?.open?.[lastIdx], lastClose)
        : lastClose;
  const volume =
    finiteNum(meta.regularMarketVolume) > 0
      ? finiteNum(meta.regularMarketVolume)
      : lastIdx >= 0
        ? finiteNum(rawQuote?.volume?.[lastIdx])
        : 0;

  const preMarketPrice = finiteNum(meta.preMarketPrice) || null;
  const preMarketChange = finiteNum(meta.preMarketChange) || null;
  const preMarketChangePercent = finiteNum(meta.preMarketChangePercent) || null;
  const postMarketPrice = finiteNum(meta.postMarketPrice) || null;
  const postMarketChange = finiteNum(meta.postMarketChange) || null;
  const postMarketChangePercent = finiteNum(meta.postMarketChangePercent) || null;

  const quote: StockDetailData['quote'] = {
    price,
    change,
    changePercent,
    previousClose,
    open,
    high,
    low,
    volume,
    marketCap: null,
    currency: meta.currency ?? 'USD',
    marketState: ((meta.marketState ?? 'CLOSED') as MarketState),
    fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh != null ? finiteNum(meta.fiftyTwoWeekHigh) : null,
    fiftyTwoWeekLow: meta.fiftyTwoWeekLow != null ? finiteNum(meta.fiftyTwoWeekLow) : null,
    preMarketPrice,
    preMarketChange,
    preMarketChangePercent,
    postMarketPrice,
    postMarketChange,
    postMarketChangePercent,
  };

  const chart: ChartDataPoint[] = timestamps
    .map((ts, i) => ({
      timestamp: ts,
      open: finiteNum(rawQuote?.open?.[i]),
      high: finiteNum(rawQuote?.high?.[i]),
      low: finiteNum(rawQuote?.low?.[i]),
      close: finiteNum(rawQuote?.close?.[i]),
      volume: finiteNum(rawQuote?.volume?.[i]),
    }))
    .filter((d) => d.close > 0);

  const name = resolveName(symbol, meta.shortName, meta.longName);

  return { quote, chart, name };
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<StocksApiResponse<StockDetailData>>> {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: { message: '심볼이 필요합니다.', code: 'NO_SYMBOL' } },
        { status: 400 },
      );
    }

    const isKr = symbol.endsWith('.KS') || symbol.endsWith('.KQ');

    // 1차: Yahoo + Naver integration을 병렬 조회
    const [yahooResult, naverResult, naverConsensusResult, yahooConsensusResult] =
      await Promise.allSettled([
        fetchV8Detail(symbol),
        isKr ? fetchNaverIntegration(symbol)     : Promise.resolve(null),
        isKr ? fetchNaverConsensusDetail(symbol) : Promise.resolve(null),
        // KR/US 모두 Yahoo consensus 시도 (Korean 종목도 Yahoo 커버리지 있음)
        fetchYahooConsensus(symbol),
      ]);

    // 2차: integration API에서 researches를 가져온 후 개별 목표가 병렬 조회
    const naverRaw = naverResult.status === 'fulfilled' ? naverResult.value : null;
    const researchPricesResult = await (async () => {
      if (!isKr || !naverRaw?.researches?.length) return [];
      return fetchNaverResearchGoalPrices(naverRaw.researches.slice(0, 6));
    })();

    if (yahooResult.status === 'rejected') {
      const message = yahooResult.reason?.message ?? '알 수 없는 오류';
      return NextResponse.json(
        {
          success: false,
          error: {
            message: '종목 데이터를 불러올 수 없습니다.',
            code: 'YAHOO_FINANCE_ERROR',
            details: message,
          },
        },
        { status: 502 },
      );
    }

    const { quote, chart, name } = yahooResult.value;
    const naver          = naverRaw;
    const naverConsensus = naverConsensusResult.status === 'fulfilled' ? naverConsensusResult.value : null;
    const yahooConsensus = yahooConsensusResult.status === 'fulfilled' ? yahooConsensusResult.value : null;

    const fundamentals = naver ? parseNaverFundamentals(naver) : null;
    const investors    = naver ? parseNaverInvestors(naver)    : null;
    const peers        = naver ? parseNaverPeers(naver)        : null;

    // ── 소스별 컨센서스 수집 ──
    const consensusBySource: StockConsensus[] = [];

    const naverC = naver ? parseNaverConsensus(naver, naverConsensus, researchPricesResult) : null;
    if (naverC) consensusBySource.push(naverC);
    if (yahooConsensus) consensusBySource.push(yahooConsensus);

    // ── 합산평균 계산 ──
    let consensus: StockConsensus | null = null;
    if (consensusBySource.length === 1) {
      consensus = consensusBySource[0];
    } else if (consensusBySource.length > 1) {
      const avgNum = (key: 'targetPrice' | 'targetHigh' | 'targetLow' | 'recommendation') => {
        const vals = consensusBySource.map((c) => c[key]).filter((v): v is number => v !== null);
        return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      };
      const totalAnalysts = consensusBySource.reduce(
        (s, c) => s + (c.numberOfAnalysts ?? 0), 0,
      );
      consensus = {
        targetPrice:      avgNum('targetPrice'),
        targetHigh:       avgNum('targetHigh'),
        targetLow:        avgNum('targetLow'),
        recommendation:   avgNum('recommendation'),
        recommendationKey: null,
        numberOfAnalysts: totalAnalysts > 0 ? totalAnalysts : null,
        sources:          ['합산평균'],
      };
    }

    // Naver 데이터로 시총 보강
    if (fundamentals?.marketValueStr && quote.marketCap === null) {
      // marketCap은 string으로만 제공하므로 null 유지, fundamentals.marketValueStr 사용
    }

    const data: StockDetailData = {
      symbol,
      name,
      quote,
      chart,
      type: getSymbolType(symbol),
      fundamentals,
      investors: investors && investors.length > 0 ? investors : null,
      consensusBySource,
      consensus,
      peers: peers && peers.length > 0 ? peers : null,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: '종목 상세 조회 중 오류 발생',
          code: 'INTERNAL_ERROR',
          details: message,
        },
      },
      { status: 500 },
    );
  }
}
