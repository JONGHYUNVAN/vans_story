// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import MarketStatusBadge from '../MarketStatusBadge';

describe('MarketStatusBadge', () => {
  it('isOpen=true일 때 "Live" 텍스트를 렌더링한다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge isOpen={true} />);
    expect(html).toContain('Live');
  });

  it('isOpen=true일 때 animate-pulse 클래스를 렌더링한다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge isOpen={true} />);
    expect(html).toContain('animate-pulse');
  });

  it('isOpen=false일 때 "장마감" 텍스트를 렌더링한다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge isOpen={false} />);
    expect(html).toContain('장마감');
  });

  it('isOpen=false일 때 "Live" 텍스트가 없다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge isOpen={false} />);
    expect(html).not.toContain('Live');
  });

  it('isOpen=false일 때 animate-pulse 클래스가 없다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge isOpen={false} />);
    expect(html).not.toContain('animate-pulse');
  });
});
