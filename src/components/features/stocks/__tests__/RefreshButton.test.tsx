// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RefreshButton from '../RefreshButton';

describe('RefreshButton', () => {
  it('isLoading=false일 때 버튼이 disabled 상태가 아니다', () => {
    const html = renderToStaticMarkup(<RefreshButton onClick={() => {}} isLoading={false} />);
    // disabled 속성이 없는지 확인
    expect(html).not.toContain('disabled=""');
  });

  it('isLoading=true일 때 버튼이 disabled 상태이다', () => {
    const html = renderToStaticMarkup(<RefreshButton onClick={() => {}} isLoading={true} />);
    expect(html).toContain('disabled');
  });

  it('isLoading=true일 때 animate-spin 클래스가 존재한다', () => {
    const html = renderToStaticMarkup(<RefreshButton onClick={() => {}} isLoading={true} />);
    expect(html).toContain('animate-spin');
  });

  it('isLoading=false일 때 animate-spin 클래스가 없다', () => {
    const html = renderToStaticMarkup(<RefreshButton onClick={() => {}} isLoading={false} />);
    expect(html).not.toContain('animate-spin');
  });

  it('"새로고침" 텍스트를 렌더링한다', () => {
    const html = renderToStaticMarkup(<RefreshButton onClick={() => {}} isLoading={false} />);
    expect(html).toContain('새로고침');
  });

  it('aria-label이 "데이터 새로고침"으로 설정된다', () => {
    const html = renderToStaticMarkup(<RefreshButton onClick={() => {}} isLoading={false} />);
    expect(html).toContain('aria-label="데이터 새로고침"');
  });
});
