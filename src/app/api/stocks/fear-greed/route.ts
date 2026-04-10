import { NextResponse } from 'next/server';

const YAHOO_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Accept: 'application/json',
};

// ── 타입 ──────────────────────────────────────────────────
interface CnnApiResponse {
  fear_and_greed: {
    score: number;
    rating: string;
    timestamp: string;
    previous_close: number;
    previous_1_week: number;
    previous_1_month: number;
    previous_1_year: number;
  };
  fear_and_greed_historical?: {
    data: { x: number; y: number; rating: string }[];
  };
}

export interface FearGreedData {
  // CNN 공포탐욕
  score: number | null;
  rating: string | null;
  previousClose: number | null;
  previous1Week: number | null;
  previous1Month: number | null;
  previous1Year: number | null;
  history: { x: number; y: number }[];
  // VIX
  vix: number | null;
  vixChange: number | null;
  vixHistory: { x: number; y: number }[];
  // CBOE SKEW (꼬리위험 지수)
  skew: number | null;
  skewChange: number | null;
  skewHistory: { x: number; y: number }[];
  // S&P500 vs 200MA
  sp500Price: number | null;
  sp500Ma200: number | null;
  sp500VsMa200Pct: number | null;  // (price / ma200 - 1) * 100
  sp500History: { x: number; y: number }[];
  // 크립토 공포탐욕
  cryptoScore: number | null;
  cryptoRating: string | null;
  cryptoHistory: { x: number; y: number }[];
  fetchedAt: string;
}

// ── fetch 함수들 ──────────────────────────────────────────
async function fetchFearGreed(): Promise<CnnApiResponse | null> {
  try {
    const res = await fetch(
      'https://production.dataviz.cnn.io/index/fearandgreed/graphdata',
      { headers: { ...YAHOO_HEADERS, Referer: 'https://www.cnn.com/' }, next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function fetchYahooMeta(
  symbol: string,
): Promise<{ price: number; prev: number; history: { x: number; y: number }[] } | null> {
  try {
    const enc = encodeURIComponent(symbol);
    const hosts = ['query1.finance.yahoo.com', 'query2.finance.yahoo.com'];
    let res: Response | null = null;
    for (const host of hosts) {
      try {
        const r = await fetch(
          `https://${host}/v8/finance/chart/${enc}?interval=1d&range=1mo`,
          { headers: YAHOO_HEADERS, cache: 'no-store' },
        );
        if (r.ok) { res = r; break; }
      } catch { /* 다음 host */ }
    }
    if (!res) return null;
    const json = await res.json();
    const result = json.chart?.result?.[0];
    if (!result) return null;
    const meta    = result.meta;
    const price   = meta.regularMarketPrice as number;
    const prev    = (meta.previousClose ?? meta.chartPreviousClose ?? 0) as number;
    const timestamps: number[] = result.timestamp ?? [];
    const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];
    const history = timestamps
      .map((t: number, i: number) => ({ x: t * 1000, y: closes[i] }))
      .filter((p): p is { x: number; y: number } => p.y != null && isFinite(p.y));
    return { price, prev, history };
  } catch { return null; }
}

async function fetchSp500Ma200(): Promise<{
  price: number;
  ma200: number;
  pct: number;
  history: { x: number; y: number }[];
} | null> {
  try {
    const hosts = ['query1.finance.yahoo.com', 'query2.finance.yahoo.com'];
    let res: Response | null = null;
    for (const host of hosts) {
      try {
        const r = await fetch(
          `https://${host}/v8/finance/chart/%5EGSPC?interval=1d&range=1y`,
          { headers: YAHOO_HEADERS, next: { revalidate: 3600 } },
        );
        if (r.ok) { res = r; break; }
      } catch { /* 다음 host */ }
    }
    if (!res) return null;
    const json = await res.json();
    const result = json.chart?.result?.[0];
    if (!result) return null;
    const timestamps: number[] = result.timestamp ?? [];
    const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];
    const valid = closes.filter((v): v is number => v != null && isFinite(v));
    if (valid.length < 50) return null;
    const price  = result.meta.regularMarketPrice as number;
    const slice  = valid.slice(-200);
    const ma200  = slice.reduce((s, v) => s + v, 0) / slice.length;
    // 최근 30일 히스토리
    const history = timestamps
      .map((t: number, i: number) => ({ x: t * 1000, y: closes[i] }))
      .filter((p): p is { x: number; y: number } => p.y != null && isFinite(p.y))
      .slice(-30);
    return { price, ma200, pct: ((price / ma200) - 1) * 100, history };
  } catch { return null; }
}

async function fetchCryptoFG(): Promise<{
  score: number;
  rating: string;
  history: { x: number; y: number }[];
} | null> {
  try {
    const res = await fetch(
      'https://api.alternative.me/fng/?limit=30',
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const data: { value: string; value_classification: string; timestamp: string }[] =
      json.data ?? [];
    if (data.length === 0) return null;
    const latest = data[0];
    const history = [...data]
      .reverse()
      .map((d) => ({ x: parseInt(d.timestamp) * 1000, y: parseInt(d.value) }));
    return {
      score:   parseInt(latest.value),
      rating:  latest.value_classification,
      history,
    };
  } catch { return null; }
}

// ── GET ──────────────────────────────────────────────────
export async function GET() {
  const [cnn, vixRaw, skewRaw, sp500, crypto] = await Promise.all([
    fetchFearGreed(),
    fetchYahooMeta('^VIX'),
    fetchYahooMeta('^SKEW'),
    fetchSp500Ma200(),
    fetchCryptoFG(),
  ]);

  if (!cnn && !vixRaw && !sp500 && !crypto) {
    return NextResponse.json(
      { success: false, error: { message: '데이터 불러오기 실패', code: 'FETCH_ERROR' } },
      { status: 502 },
    );
  }

  const fg   = cnn?.fear_and_greed ?? null;
  const hist = (cnn?.fear_and_greed_historical?.data ?? [])
    .slice(-30).map(({ x, y }) => ({ x, y }));

  const data: FearGreedData = {
    score:          fg?.score           ?? null,
    rating:         fg?.rating          ?? null,
    previousClose:  fg?.previous_close  ?? null,
    previous1Week:  fg?.previous_1_week ?? null,
    previous1Month: fg?.previous_1_month ?? null,
    previous1Year:  fg?.previous_1_year  ?? null,
    history: hist,

    vix:        vixRaw?.price ?? null,
    vixChange:  vixRaw && vixRaw.prev > 0
      ? ((vixRaw.price - vixRaw.prev) / vixRaw.prev) * 100 : null,
    vixHistory: vixRaw?.history ?? [],

    skew:        skewRaw?.price ?? null,
    skewChange:  skewRaw && skewRaw.prev > 0
      ? ((skewRaw.price - skewRaw.prev) / skewRaw.prev) * 100 : null,
    skewHistory: skewRaw?.history ?? [],

    sp500Price:      sp500?.price   ?? null,
    sp500Ma200:      sp500?.ma200   ?? null,
    sp500VsMa200Pct: sp500?.pct     ?? null,
    sp500History:    sp500?.history ?? [],

    cryptoScore:   crypto?.score   ?? null,
    cryptoRating:  crypto?.rating  ?? null,
    cryptoHistory: crypto?.history ?? [],

    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, data });
}
