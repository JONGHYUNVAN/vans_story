// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import StockCard from '../StockCard';
import type { StockPrice } from '@/types/stocks';

function makeMockStock(overrides: Partial<StockPrice> = {}): StockPrice {
  return {
    symbol: 'NVDA',
    name: 'NVIDIA',
    price: 120.5,
    change: 2.5,
    changePercent: 2.12,
    previousClose: 118.0,
    open: 119.0,
    high: 122.0,
    low: 118.5,
    volume: 5000000,
    marketCap: 3000000000000,
    currency: 'USD',
    market: 'us',
    marketState: 'REGULAR',
    updatedAt: 1700000000,
    ...overrides,
  };
}

describe('StockCard', () => {
  describe('로딩 상태', () => {
    it('isLoading=true일 때 스켈레톤 UI(animate-pulse)를 렌더링한다', () => {
      const html = renderToStaticMarkup(<StockCard isLoading={true} />);
      expect(html).toContain('animate-pulse');
    });

    it('isLoading=true일 때 종목명이 없다', () => {
      const html = renderToStaticMarkup(<StockCard isLoading={true} />);
      expect(html).not.toContain('NVIDIA');
    });
  });

  describe('에러 상태', () => {
    it('isError=true일 때 에러 메시지를 렌더링한다', () => {
      const html = renderToStaticMarkup(<StockCard isError={true} />);
      expect(html).toContain('데이터를 불러오지 못했습니다.');
    });

    it('stock이 없을 때 에러 메시지를 렌더링한다', () => {
      const html = renderToStaticMarkup(<StockCard />);
      expect(html).toContain('데이터를 불러오지 못했습니다.');
    });
  });

  describe('정상 데이터', () => {
    it('종목명을 표시한다', () => {
      const stock = makeMockStock();
      const html = renderToStaticMarkup(<StockCard stock={stock} />);
      expect(html).toContain('NVIDIA');
    });

    it('심볼을 표시한다', () => {
      const stock = makeMockStock();
      const html = renderToStaticMarkup(<StockCard stock={stock} />);
      expect(html).toContain('NVDA');
    });

    it('가격을 표시한다', () => {
      const stock = makeMockStock({ price: 120.5, currency: 'USD' });
      const html = renderToStaticMarkup(<StockCard stock={stock} />);
      expect(html).toContain('$120.50');
    });

    it('KRW 가격에 원 단위를 표시한다', () => {
      const stock = makeMockStock({
        symbol: '005930.KS',
        name: '삼성전자',
        price: 60000,
        currency: 'KRW',
        market: 'kr',
      });
      const html = renderToStaticMarkup(<StockCard stock={stock} />);
      expect(html).toContain('원');
    });

    it('등락률을 표시한다', () => {
      const stock = makeMockStock({ changePercent: 2.12 });
      const html = renderToStaticMarkup(<StockCard stock={stock} />);
      expect(html).toContain('2.12%');
    });
  });

  describe('색상 클래스', () => {
    it('상승(change>0)일 때 text-red-400 클래스가 적용된다', () => {
      const stock = makeMockStock({ change: 2.5, changePercent: 2.12 });
      const html = renderToStaticMarkup(<StockCard stock={stock} />);
      expect(html).toContain('text-red-400');
    });

    it('하락(change<0)일 때 text-blue-400 클래스가 적용된다', () => {
      const stock = makeMockStock({ change: -1.5, changePercent: -1.27 });
      const html = renderToStaticMarkup(<StockCard stock={stock} />);
      expect(html).toContain('text-blue-400');
    });

    it('상승(change>0)일 때 위 화살표(▲)가 표시된다', () => {
      const stock = makeMockStock({ change: 2.5 });
      const html = renderToStaticMarkup(<StockCard stock={stock} />);
      expect(html).toContain('▲');
    });

    it('하락(change<0)일 때 아래 화살표(▼)가 표시된다', () => {
      const stock = makeMockStock({ change: -1.5 });
      const html = renderToStaticMarkup(<StockCard stock={stock} />);
      expect(html).toContain('▼');
    });
  });

  describe('마켓 배지', () => {
    it('market=us일 때 "US" 배지를 표시한다', () => {
      const stock = makeMockStock({ market: 'us' });
      const html = renderToStaticMarkup(<StockCard stock={stock} />);
      expect(html).toContain('US');
    });

    it('market=kr일 때 "KRX" 배지를 표시한다', () => {
      const stock = makeMockStock({
        symbol: '005930.KS',
        market: 'kr',
        currency: 'KRW',
      });
      const html = renderToStaticMarkup(<StockCard stock={stock} />);
      expect(html).toContain('KRX');
    });
  });
});
