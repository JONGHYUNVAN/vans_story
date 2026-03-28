/**
 * 종목별 상세 페이지 메타 정보
 * - description: 종목 한 줄 설명
 * - sector: 업종
 * - relatedKrSymbols: 연관 국장 종목 (미장 종목에서 사용)
 * - relatedUsWithReason: 연관 미장 종목 with reason (국장 종목에서 사용)
 * - relatedMacroSymbols: 연관 거시지표 (국장 종목에서 사용)
 * - relatedSymbols: 연관 종목 전체 (거시지표에서 사용)
 */

export interface RelatedUsStock {
  symbol: string;
  reason: string;
}

export interface StockRelationMeta {
  description: string;
  sector: string;
  relatedKrSymbols?: string[];
  relatedUsWithReason?: RelatedUsStock[];
  relatedMacroSymbols?: string[];
  relatedSymbols?: string[];
}

export const STOCK_RELATIONS: Record<string, StockRelationMeta> = {
  // ── 국장 종목 ──
  '005930.KS': {
    description:
      'DRAM·NAND·파운드리·디스플레이를 아우르는 글로벌 종합 반도체 기업. HBM 공급 및 파운드리 경쟁력이 핵심 관전 포인트.',
    sector: '종합 반도체',
    relatedUsWithReason: [
      { symbol: 'NVDA', reason: 'HBM 최대 수요처' },
      { symbol: 'AAPL', reason: '디스플레이·메모리 고객' },
      { symbol: 'QCOM', reason: '파운드리 고객' },
      { symbol: 'AVGO', reason: 'AI 반도체 고객' },
    ],
    relatedMacroSymbols: ['USDKRW=X', '^KS11', '^SOX', '^IXIC'],
  },
  '000660.KS': {
    description:
      'HBM(고대역폭메모리) 기술 세계 선도 기업. AI 가속기 붐에 따른 HBM 수요 증가의 최대 수혜주.',
    sector: 'DRAM/HBM',
    relatedUsWithReason: [
      { symbol: 'NVDA', reason: 'HBM 최대 수요처' },
      { symbol: 'MSFT', reason: 'HBM 간접 수요' },
      { symbol: 'AMD', reason: 'HBM 고객' },
    ],
    relatedMacroSymbols: ['USDKRW=X', '^KS11', '^SOX', '^IXIC'],
  },
  '005380.KS': {
    description: '글로벌 전기차·수소차 전환 선두 주자. 현대·기아 브랜드로 글로벌 판매 3위권.',
    sector: '자동차/EV',
    relatedUsWithReason: [{ symbol: 'TSLA', reason: '글로벌 EV 경쟁사' }],
    relatedMacroSymbols: ['USDKRW=X', '^KS11', '^KQ11'],
  },

  // ── 미장 종목 ──
  NVDA: {
    description:
      '삼성전자·SK하이닉스의 HBM(고대역폭 메모리) 최대 수요처. NVDA 실적·가이던스는 국내 반도체주에 직접 영향을 미친다.',
    sector: 'AI/GPU',
    relatedKrSymbols: ['005930.KS', '000660.KS'],
  },
  AAPL: {
    description:
      '삼성전자 디스플레이(OLED)·메모리 주요 고객. Apple 신제품 수요는 삼성 부품 사업부 실적과 연동된다.',
    sector: '소비자 기술',
    relatedKrSymbols: ['005930.KS'],
  },
  QCOM: {
    description:
      '삼성 파운드리 주요 고객사. Qualcomm 신규 칩 수주 여부가 삼성 파운드리 가동률에 영향을 준다.',
    sector: '반도체/통신',
    relatedKrSymbols: ['005930.KS'],
  },
  AMD: {
    description:
      '삼성·하이닉스 메모리 고객. AI 가속기 시장에서 NVDA와 경쟁하며 HBM 수요 창출.',
    sector: 'CPU/GPU',
    relatedKrSymbols: ['005930.KS', '000660.KS'],
  },
  INTC: {
    description:
      '삼성 파운드리 잠재 고객 겸 경쟁사. Intel 파운드리 전략 변화는 삼성 파운드리 수주에 영향.',
    sector: '반도체',
    relatedKrSymbols: ['005930.KS'],
  },
  TSLA: {
    description:
      '현대차 전기차 사업의 글로벌 최대 경쟁사. TSLA 판매량·마진이 현대차 전기차 전략의 기준점.',
    sector: 'EV/에너지',
    relatedKrSymbols: ['005380.KS'],
  },
  MSFT: {
    description:
      'AI 서버 투자를 통해 NVDA GPU·HBM 수요를 간접 견인. 삼성·하이닉스 수혜.',
    sector: '클라우드/AI',
    relatedKrSymbols: ['005930.KS', '000660.KS'],
  },
  AVGO: {
    description:
      'AI 커스텀 반도체(ASIC) 선두. NVDA 의존도를 줄이려는 하이퍼스케일러의 대안으로 HBM 수요 창출.',
    sector: '반도체/인프라',
    relatedKrSymbols: ['000660.KS', '005930.KS'],
  },

  // ── 거시지표 ──
  'USDKRW=X': {
    description:
      '원달러 환율. 상승(원화 약세) 시 수출 대기업 실적엔 긍정적이지만 수입물가 상승 우려도 동반된다.',
    sector: '환율',
    relatedSymbols: ['005930.KS', '000660.KS', '005380.KS'],
  },
  '^TNX': {
    description:
      '미국 국채 10년물 금리. 상승 시 성장주 밸류에이션 하락 압력으로 기술주·반도체주에 부정적.',
    sector: '채권',
    relatedSymbols: ['NVDA', 'MSFT'],
  },
  '^KS11': {
    description:
      '국내 코스피 종합지수. 외국인 순매수·원달러 환율·글로벌 투자심리에 민감하게 반응한다.',
    sector: '지수',
    relatedSymbols: ['005930.KS', '000660.KS', '005380.KS'],
  },
  '^KQ11': {
    description:
      '중소형·기술주 중심 지수. 개인 투자자 비중이 높아 변동성이 크다.',
    sector: '지수',
    relatedSymbols: [],
  },
  '^IXIC': {
    description:
      '미국 기술주 중심 종합지수. 국내 반도체·IT주와 동조화 경향이 가장 강하다.',
    sector: '지수',
    relatedSymbols: ['NVDA', 'AAPL', 'MSFT', 'TSLA'],
  },
  '^GSPC': {
    description:
      '미국 대형주 500개 종합지수. 글로벌 위험자산 투자심리의 기준이 된다.',
    sector: '지수',
    relatedSymbols: ['NVDA', 'AAPL', 'MSFT', 'TSLA'],
  },
  '^SOX': {
    description:
      '필라델피아 반도체 지수. 삼성전자·SK하이닉스 주가와 가장 밀접하게 연동된다.',
    sector: '반도체 지수',
    relatedSymbols: ['005930.KS', '000660.KS', 'NVDA', 'AMD'],
  },
};

export function getStockRelation(symbol: string): StockRelationMeta {
  return STOCK_RELATIONS[symbol] ?? { description: '', sector: '' };
}
