// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import MacroPanel from '../MacroPanel';
import type { MacroData } from '@/types/stocks';

function makeMockMacroData(): MacroData {
  return {
    currency: [
      {
        symbol: 'USDKRW=X',
        name: 'USD/KRW',
        displayName: '원/달러 환율',
        price: 1380.5,
        change: 5.0,
        changePercent: 0.36,
        category: 'currency',
      },
    ],
    bond: [
      {
        symbol: '^TNX',
        name: 'US 10Y Treasury',
        displayName: '미국 10년 국채',
        price: 4.312,
        change: -0.05,
        changePercent: -1.15,
        category: 'bond',
      },
    ],
    index: [
      {
        symbol: '^KS11',
        name: 'KOSPI',
        displayName: '코스피',
        price: 2520.3,
        change: 12.5,
        changePercent: 0.50,
        category: 'index',
      },
    ],
    fetchedAt: new Date().toISOString(),
  };
}

describe('MacroPanel', () => {
  describe('로딩 상태', () => {
    it('isLoading=true일 때 스켈레톤 UI(animate-pulse)를 렌더링한다', () => {
      const html = renderToStaticMarkup(<MacroPanel macro={null} isLoading={true} />);
      expect(html).toContain('animate-pulse');
    });

    it('isLoading=true일 때 스켈레톤 아이템을 7개 렌더링한다', () => {
      const html = renderToStaticMarkup(<MacroPanel macro={null} isLoading={true} />);
      const matchCount = (html.match(/animate-pulse/g) || []).length;
      expect(matchCount).toBe(7);
    });

    it('isLoading=true일 때 지표 이름이 표시되지 않는다', () => {
      const html = renderToStaticMarkup(<MacroPanel macro={null} isLoading={true} />);
      expect(html).not.toContain('원/달러 환율');
    });
  });

  describe('데이터 표시', () => {
    it('isLoading=false이고 데이터가 있을 때 거시 지표 섹션 제목을 표시한다', () => {
      const html = renderToStaticMarkup(<MacroPanel macro={makeMockMacroData()} isLoading={false} />);
      expect(html).toContain('거시 지표');
    });

    it('currency 지표의 displayName을 표시한다', () => {
      const html = renderToStaticMarkup(<MacroPanel macro={makeMockMacroData()} isLoading={false} />);
      expect(html).toContain('원/달러 환율');
    });

    it('bond 지표의 displayName을 표시한다', () => {
      const html = renderToStaticMarkup(<MacroPanel macro={makeMockMacroData()} isLoading={false} />);
      expect(html).toContain('미국 10년 국채');
    });

    it('index 지표의 displayName을 표시한다', () => {
      const html = renderToStaticMarkup(<MacroPanel macro={makeMockMacroData()} isLoading={false} />);
      expect(html).toContain('코스피');
    });

    it('USDKRW=X 지표는 가격에 "원" 단위를 붙인다', () => {
      const html = renderToStaticMarkup(<MacroPanel macro={makeMockMacroData()} isLoading={false} />);
      expect(html).toContain('원');
    });

    it('^TNX 지표는 가격에 "%" 단위를 붙인다', () => {
      const html = renderToStaticMarkup(<MacroPanel macro={makeMockMacroData()} isLoading={false} />);
      expect(html).toContain('%');
    });

    it('macro=null이고 isLoading=false이면 지표가 렌더링되지 않는다', () => {
      const html = renderToStaticMarkup(<MacroPanel macro={null} isLoading={false} />);
      expect(html).not.toContain('원/달러 환율');
    });

    it('상승 지표에 text-rose-400 클래스가 적용된다', () => {
      const html = renderToStaticMarkup(<MacroPanel macro={makeMockMacroData()} isLoading={false} />);
      expect(html).toContain('text-rose-400');
    });

    it('하락 지표에 text-sky-400 클래스가 적용된다', () => {
      const html = renderToStaticMarkup(<MacroPanel macro={makeMockMacroData()} isLoading={false} />);
      expect(html).toContain('text-sky-400');
    });
  });
});
