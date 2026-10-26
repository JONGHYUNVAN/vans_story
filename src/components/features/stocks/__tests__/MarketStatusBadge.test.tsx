// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import MarketStatusBadge from '../MarketStatusBadge';

describe('MarketStatusBadge', () => {
  it('state=REGULAR, market=kr일 때 "장중" 텍스트를 렌더링한다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge state="REGULAR" market="kr" />);
    expect(html).toContain('장중');
  });

  it('state=REGULAR, market=us일 때 "Open" 텍스트를 렌더링한다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge state="REGULAR" market="us" />);
    expect(html).toContain('Open');
  });

  it('state=REGULAR일 때 animate-pulse 클래스를 렌더링한다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge state="REGULAR" market="kr" />);
    expect(html).toContain('animate-pulse');
  });

  it('state=CLOSED, market=kr일 때 "장마감" 텍스트를 렌더링한다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge state="CLOSED" market="kr" />);
    expect(html).toContain('장마감');
  });

  it('state=CLOSED, market=us일 때 "Closed" 텍스트를 렌더링한다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge state="CLOSED" market="us" />);
    expect(html).toContain('Closed');
  });

  it('state=CLOSED일 때 "장중" 텍스트가 없다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge state="CLOSED" market="kr" />);
    expect(html).not.toContain('장중');
  });

  it('state=CLOSED일 때 animate-pulse 클래스가 없다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge state="CLOSED" market="kr" />);
    expect(html).not.toContain('animate-pulse');
  });

  it('state=PRE, market=kr일 때 "장전" 텍스트를 렌더링하고 animate-pulse는 없다', () => {
    const html = renderToStaticMarkup(<MarketStatusBadge state="PRE" market="kr" />);
    expect(html).toContain('장전');
    expect(html).not.toContain('animate-pulse');
  });
});
