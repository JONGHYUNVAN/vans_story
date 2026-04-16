'use client';

import { useEffect, useState } from 'react';

export interface GameSizeOptions {
  aspectRatio: number; // width / height
  maxWidth: number;
  maxHeight: number;
  gridCols?: number; // 있으면 cellSize = floor(width / gridCols) 반환
}

export interface GameSizeResult {
  width: number;
  height: number;
  cellSize: number; // gridCols 없으면 0
  ready: boolean;
}

const MOBILE_BREAKPOINT = 768;    // md breakpoint
const MOBILE_CONTROLLER_H = 180; // fixed 게임패드 높이
const APPROX_HEADER_H = 60;       // 페이지 헤더 높이
const MARGIN_V = 40;              // 상하 여백

function calculate(options: GameSizeOptions): Omit<GameSizeResult, 'ready'> {
  const { aspectRatio, maxWidth, maxHeight, gridCols } = options;

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

  // Width
  const availableW = Math.min(window.innerWidth - 32, maxWidth);

  // Height: 모바일은 컨트롤러 높이 + 헤더 + 여백 차감
  const reservedH = isMobile
    ? MOBILE_CONTROLLER_H + APPROX_HEADER_H + MARGIN_V
    : APPROX_HEADER_H + MARGIN_V;
  const availableH = Math.min(window.innerHeight - reservedH, maxHeight);

  let w = availableW;
  let h = w / aspectRatio;

  if (h > availableH) {
    h = availableH;
    w = h * aspectRatio;
  }

  const width = Math.floor(w);
  const height = Math.floor(h);
  const cellSize = gridCols ? Math.floor(width / gridCols) : 0;

  return { width, height, cellSize };
}

export function useGameSize(options: GameSizeOptions): GameSizeResult {
  const [result, setResult] = useState<GameSizeResult>({
    width: options.maxWidth,
    height: options.maxHeight,
    cellSize: options.gridCols ? Math.floor(options.maxWidth / options.gridCols) : 0,
    ready: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      const { width, height, cellSize } = calculate(options);
      setResult({ width, height, cellSize, ready: true });
    };

    update();

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.aspectRatio, options.maxWidth, options.maxHeight, options.gridCols]);

  return result;
}
