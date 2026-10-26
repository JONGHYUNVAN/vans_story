'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/_components/GamePageClient';
import { useSound } from '@/hooks/useSound';
import { useCombo } from '@/hooks/useCombo';
import { useScreenShake } from '@/hooks/useScreenShake';
import { useGameSize } from '@/hooks/useGameSize';
import { useGameLoop } from '@/hooks/useGameLoop';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';
import GameOverlayController from '@/components/features/games/GameOverlayController';

// ── 상수 ────────────────────────────────────────────────
const W  = 320, H = 560;
const GRAVITY = 0.11, LIFT = 0.30, DAMPEN = 0.983;
const MAX_UP = -6.5, MAX_DOWN = 7.5;
const SPD     = -5;    // 기본 오브젝트 속도
const GH  = 24;        // 바닥 높이
const BX  = 80;        // 새 X
const SPAWN_MS  = 1050;
const TRAIL_LEN = 38;
const TRAIL_DX  = 5.0; // 꼬리 점당 수평 간격
const ROLL_DUR  = 180; // ms — 급선회 잔상 효과
const ROLL_CD   = 700; // ms — 쿨다운
const MSL_SPD   = -10; // 미사일 속도

// ── 정적 데이터 (모듈 1회) ───────────────────────────────
const mkStars = (n: number, mr: number, ma: number) =>
  Array.from({ length: n }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * mr + 0.2, a: Math.random() * ma + 0.08,
  }));
const L1 = mkStars(52, 0.7, 0.35);
const L2 = mkStars(28, 1.2, 0.60);
const L3 = mkStars(12, 1.9, 0.90);

// ── 사이버 도시 레이어 ──────────────────────────────────
interface CityLayer { speed: number; canvas: HTMLCanvasElement; h: number; }

function makeCityLayer(speed: number, minH: number, maxH: number, color: string, winDensity: number): CityLayer {
  const CW = W * 3, CH = maxH + 20;
  const lc = document.createElement('canvas');
  lc.width = CW; lc.height = CH;
  const lx = lc.getContext('2d')!;
  let bx = 0;
  while (bx < CW) {
    const bw = 28 + Math.random() * 72;
    const bh = minH + Math.random() * (maxH - minH);
    lx.fillStyle = color;
    lx.fillRect(bx, CH - bh, bw, bh);
    for (let wy = CH - bh + 6; wy < CH - 4; wy += 10) {
      for (let wx = bx + 4; wx < bx + bw - 4; wx += 9) {
        if (Math.random() < winDensity) {
          const wc = Math.random() < 0.38 ? '#ff1144' : Math.random() < 0.55 ? '#0088ff' : '#ffaa00';
          lx.fillStyle = wc; lx.shadowColor = wc; lx.shadowBlur = 6;
          lx.fillRect(wx, wy, 3, 5);
        }
      }
    }
    lx.shadowBlur = 0;
    bx += bw + 3 + Math.random() * 18;
  }
  return { speed, canvas: lc, h: CH };
}

function drawCityBg(ctx: CanvasRenderingContext2D, layers: CityLayer[], sc: number) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#020308'); g.addColorStop(0.65, '#04040d'); g.addColorStop(1, '#060612');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (const L of layers) {
    const offset = (sc * L.speed) % (W * 2);
    ctx.drawImage(L.canvas, -offset, H - GH - L.h + 20);
  }
}

function drawVignette(ctx: CanvasRenderingContext2D) {
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.18, W / 2, H / 2, H * 0.92);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.62)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

function drawScanlines(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(0,0,0,0.04)';
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
}

const SLINES = Array.from({ length: 52 }, () => ({
  sx:  Math.random() * W * 2.5,
  y:   Math.random() * H * 0.94,
  len: 48 + Math.random() * 100,
  spd: 5.0 + Math.random() * 6.0,
  a:   0.14 + Math.random() * 0.38,
}));

// ── 타입 ─────────────────────────────────────────────────
type GameStatus = 'idle' | 'playing' | 'gameover';
// missile=유도미사일, mine=부유지뢰
type ObjKind = 'missile' | 'mine';
interface Obj { x: number; kind: ObjKind; cy: number; vy: number; r: number; passed: boolean; }

// ══ 순수 렌더 함수 (컴포넌트 외부) ══════════════════════

function rStars(ctx: CanvasRenderingContext2D, sc: number) {
  for (const [layer, spd] of [[L1, 0.06], [L2, 0.20], [L3, 0.52]] as const) {
    for (const s of layer) {
      const x = ((s.x - sc * spd) % W + W) % W;
      ctx.beginPath(); ctx.arc(x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`; ctx.fill();
    }
  }
}

function rLines(ctx: CanvasRenderingContext2D, sc: number, playing: boolean) {
  const am = playing ? 1.0 : 0.28;
  ctx.save();
  for (const sl of SLINES) {
    const period = W + sl.len + 80;
    const x = ((sl.sx - sc * sl.spd) % period + period) % period - sl.len;
    const g = ctx.createLinearGradient(x, 0, x + sl.len, 0);
    g.addColorStop(0, 'rgba(200,220,255,0)');
    g.addColorStop(1, `rgba(200,220,255,${sl.a * am})`);
    ctx.beginPath(); ctx.moveTo(x, sl.y); ctx.lineTo(x + sl.len, sl.y);
    ctx.strokeStyle = g; ctx.lineWidth = 0.75; ctx.stroke();
  }
  ctx.restore();
}

function rGrid(ctx: CanvasRenderingContext2D, sc: number) {
  const gY = H - GH, hY = gY - 88, cx = W / 2, cW = W / 10;
  const off = (sc * 0.65) % cW;
  ctx.save(); ctx.globalAlpha = 0.21; ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 0.75;
  for (let i = 0; i <= 9; i++) {
    const t = i / 9, y = hY + (gY - hY) * t * t;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  for (let i = -1; i <= 12; i++) {
    const xB = i * cW - off, xT = cx + (xB - cx) * 0.04;
    ctx.beginPath(); ctx.moveTo(xB, gY); ctx.lineTo(xT, hY); ctx.stroke();
  }
  ctx.restore();
}

function rTrail(ctx: CanvasRenderingContext2D, trail: number[], ts: number) {
  if (trail.length < 3) return;
  const len = trail.length;
  const tx  = BX - (len - 1) * TRAIL_DX;
  ctx.save();

  // 트윈 엔진 배기 — 상단 나셀(-3.5) / 하단 나셀(+3.5) 각각 2가닥
  for (const nozzleOff of [-3.5, 3.5]) {
    for (let w = 0; w < 2; w++) {
      const isCore = w === 0;

      const g = ctx.createLinearGradient(tx, 0, BX, 0);
      if (isCore) {
        g.addColorStop(0,    'rgba(109,40,217,0)');
        g.addColorStop(0.35, 'rgba(34,211,238,0.38)');
        g.addColorStop(0.75, 'rgba(186,230,253,0.80)');
        g.addColorStop(1,    'rgba(255,255,255,0.95)');
      } else {
        g.addColorStop(0,   'rgba(76,29,149,0)');
        g.addColorStop(0.5, 'rgba(109,40,217,0.20)');
        g.addColorStop(1,   'rgba(139,92,246,0.46)');
      }

      ctx.beginPath();
      trail.forEach((baseY, i) => {
        const x    = BX - (len - 1 - i) * TRAIL_DX;
        const age  = i / len;
        const spread = (1 - age) * (isCore ? 1.2 : 2.4);
        const turb = Math.sin(i * 1.8 + w * 2.1 + nozzleOff + ts * 0.003) * spread;
        const y    = baseY + nozzleOff * (0.82 + age * 0.18) + turb;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });

      ctx.strokeStyle = g;
      ctx.lineWidth   = isCore ? 3.6 : 1.6;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (isCore) { ctx.shadowBlur = 16; ctx.shadowColor = '#22d3ee'; }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  ctx.restore();
}

// ── 전투기 렌더 (F-22 스타일 스텔스 파이터) ──────────────
function rBird(ctx: CanvasRenderingContext2D, y: number, vel: number, ts: number, upHeld: boolean, downHeld: boolean, rollPct: number) {
  const tilt      = Math.max(-0.44, Math.min(0.62, vel * 0.082));
  const thrust    = upHeld || downHeld;
  const pulse     = 0.65 + 0.35 * Math.sin(ts * 0.05);
  const wink      = 0.55 + 0.45 * Math.sin(ts * 0.007);
  const thrustCol = upHeld ? '#22d3ee' : downHeld ? '#f97316' : '#a78bfa';

  ctx.save();
  ctx.translate(BX, y);
  ctx.rotate(tilt);

  // ── 충격파 링 ────────────────────────────────────────
  if (rollPct > 0) {
    const rad = 20 + (1 - rollPct) * 36;
    ctx.shadowBlur = 42 * rollPct; ctx.shadowColor = '#22d3ee';
    ctx.strokeStyle = `rgba(34,211,238,${rollPct * 0.9})`;
    ctx.lineWidth = 2.5 * rollPct + 0.5;
    ctx.beginPath(); ctx.ellipse(0, 0, rad, rad * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke(); ctx.shadowBlur = 0;
  }

  // ── 트윈 애프터버너 ──────────────────────────────────
  for (const oy of [-3.5, 3.5]) {
    const eLen = thrust ? 22 + Math.sin(ts * 0.05 + oy) * 10 : 7 + Math.sin(ts * 0.022 + oy) * 3;
    const eA   = thrust ? 0.88 + 0.12 * Math.sin(ts * 0.04) : 0.32;
    // 외부 플리커 광
    const eg = ctx.createRadialGradient(-21, oy, 0, -21 - eLen * 0.55, oy, eLen * 0.85);
    eg.addColorStop(0, upHeld   ? `rgba(34,211,238,${eA})`
                     : downHeld ? `rgba(249,115,22,${eA})`
                                : `rgba(167,139,250,${eA * 0.8})`);
    eg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.shadowBlur = thrust ? 18 : 6; ctx.shadowColor = thrustCol;
    ctx.beginPath(); ctx.ellipse(-21 - eLen * 0.45, oy, eLen * 0.56, thrust ? 5.5 : 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = eg; ctx.fill();
    // 코어 화염
    ctx.beginPath(); ctx.ellipse(-21 - eLen * 0.22, oy, eLen * 0.25, thrust ? 2.4 : 1.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(230,245,255,0.95)'; ctx.fill();
    ctx.shadowBlur = 0;
  }

  // ── 주 델타 날개 ─────────────────────────────────────
  for (const s of [-1, 1] as const) {
    ctx.beginPath();
    ctx.moveTo(12, s * 3.5);
    ctx.lineTo(-6,  s * 28);    // 날개 끝 (뾰족)
    ctx.lineTo(-9,  s * 27);
    ctx.lineTo(-19, s *  6);    // 후연
    ctx.lineTo(-14, s * 3.5);
    ctx.closePath();
    const wg = ctx.createLinearGradient(12, 0, -6, s * 28);
    wg.addColorStop(0,   '#16113c');
    wg.addColorStop(0.6, '#0d0a26');
    wg.addColorStop(1,   '#07051a');
    ctx.fillStyle = wg;
    ctx.shadowBlur = 10; ctx.shadowColor = '#4c1d95'; ctx.fill();
    ctx.strokeStyle = '#5b21b6'; ctx.lineWidth = 1.0; ctx.stroke(); ctx.shadowBlur = 0;
    // 패널 라인 (구조 강조선)
    ctx.strokeStyle = 'rgba(109,40,217,0.30)'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(6, s * 7); ctx.lineTo(-7, s * 24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1, s * 5); ctx.lineTo(-13, s * 17); ctx.stroke();
    // 항법등 — 위쪽 청록, 아래쪽 적색
    const navCol = s < 0 ? [34, 211, 238] : [248, 113, 113];
    ctx.shadowBlur = 14 * wink; ctx.shadowColor = `rgb(${navCol})`;
    ctx.fillStyle = `rgba(${navCol},${0.65 + 0.35 * wink})`;
    ctx.beginPath(); ctx.arc(-6, s * 28, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
  }

  // ── 카나드 (전면 소형 날개) ──────────────────────────
  for (const s of [-1, 1] as const) {
    ctx.beginPath();
    ctx.moveTo(17, s * 2.5);
    ctx.lineTo(11, s * 12);
    ctx.lineTo( 9, s * 10);
    ctx.lineTo(13, s * 2.5);
    ctx.closePath();
    const cwg = ctx.createLinearGradient(17, 0, 11, s * 12);
    cwg.addColorStop(0, '#14103e'); cwg.addColorStop(1, '#08061c');
    ctx.fillStyle = cwg;
    ctx.strokeStyle = '#6d28d9'; ctx.lineWidth = 0.85; ctx.fill(); ctx.stroke();
  }

  // ── 동체 ────────────────────────────────────────────
  ctx.save();
  ctx.shadowBlur = 26; ctx.shadowColor = '#2e1065';
  ctx.beginPath();
  ctx.moveTo(28,  0);                              // 기수 첨단
  ctx.bezierCurveTo(23, -3.5,  8, -6.2, -4, -5.8); // 등면
  ctx.lineTo(-13, -5.8); ctx.lineTo(-22, -4.8);   // 나셀 상단
  ctx.lineTo(-22,  4.8); ctx.lineTo(-13,  5.8);   // 나셀 하단
  ctx.lineTo( -4,  5.8);
  ctx.bezierCurveTo(8, 6.2, 23, 3.5, 28, 0);      // 배면
  ctx.closePath();
  const fbg = ctx.createLinearGradient(28, -6, -22, 5);
  fbg.addColorStop(0,   '#20144e');
  fbg.addColorStop(0.4, '#150f36');
  fbg.addColorStop(0.8, '#0c0820');
  fbg.addColorStop(1,   '#07051a');
  ctx.fillStyle = fbg; ctx.fill();
  ctx.strokeStyle = '#4c1d95'; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.shadowBlur = 0; ctx.restore();

  // ── 동체 금속 하이라이트 ──────────────────────────────
  ctx.beginPath();
  ctx.moveTo(24, -1.2); ctx.bezierCurveTo(14, -3.8, 2, -4.2, -10, -3.4);
  ctx.strokeStyle = 'rgba(196,181,253,0.28)'; ctx.lineWidth = 1.1; ctx.stroke();
  // 하단 반사
  ctx.beginPath();
  ctx.moveTo(20, 1.0); ctx.bezierCurveTo(10, 3.0, -2, 3.5, -12, 2.8);
  ctx.strokeStyle = 'rgba(109,40,217,0.15)'; ctx.lineWidth = 0.8; ctx.stroke();

  // ── 쌍발 수직 꼬리날개 ──────────────────────────────
  for (const ox of [-11, -16] as const) {
    ctx.beginPath();
    ctx.moveTo(ox + 2, -5.5);
    ctx.lineTo(ox - 4, -21);
    ctx.lineTo(ox - 1, -19);
    ctx.lineTo(ox + 4, -5.5);
    ctx.closePath();
    const tg = ctx.createLinearGradient(ox, -5, ox - 4, -21);
    tg.addColorStop(0, '#100c30'); tg.addColorStop(1, '#07051c');
    ctx.fillStyle = tg;
    ctx.strokeStyle = '#5b21b6'; ctx.lineWidth = 0.85; ctx.fill(); ctx.stroke();
    // 꼬리날개 엣지 라인
    ctx.strokeStyle = 'rgba(139,92,246,0.22)'; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(ox, -7); ctx.lineTo(ox - 3, -19); ctx.stroke();
  }

  // ── 엔진 나셀 노즐 ───────────────────────────────────
  for (const oy of [-3.5, 3.5]) {
    // 나셀 외형
    ctx.beginPath(); ctx.ellipse(-21, oy, 4.2, 3.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#060410';
    ctx.shadowBlur = 12 * pulse; ctx.shadowColor = thrustCol;
    ctx.strokeStyle = thrustCol; ctx.lineWidth = 1.3;
    ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    // 노즐 내부 글로우
    const ig = ctx.createRadialGradient(-21, oy, 0, -21, oy, 3.6);
    ig.addColorStop(0, upHeld   ? 'rgba(34,211,238,0.85)'
                      : downHeld ? 'rgba(249,115,22,0.85)'
                                 : `rgba(167,139,250,${0.45 + 0.35 * pulse})`);
    ig.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.ellipse(-21, oy, 3.4, 2.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = ig; ctx.fill();
  }

  // ── 콕핏 ────────────────────────────────────────────
  ctx.save();
  ctx.beginPath(); ctx.ellipse(12, -3.2, 7.8, 4.0, -0.08, 0, Math.PI * 2);
  ctx.fillStyle = '#030b18';
  ctx.shadowBlur = 16; ctx.shadowColor = '#22d3ee'; ctx.fill();
  ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 0.9; ctx.stroke(); ctx.shadowBlur = 0;
  // 반사광 (위쪽)
  const cgh = ctx.createLinearGradient(7, -7.5, 16, -1);
  cgh.addColorStop(0, 'rgba(186,230,253,0.48)');
  cgh.addColorStop(0.55, 'rgba(34,211,238,0.10)');
  cgh.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = cgh; ctx.fill();
  // 글로우 외곽
  ctx.shadowBlur = 18 * wink; ctx.shadowColor = '#22d3ee';
  ctx.strokeStyle = `rgba(34,211,238,${0.22 + 0.18 * wink})`; ctx.lineWidth = 1.1;
  ctx.beginPath(); ctx.ellipse(12, -3.2, 8.6, 4.6, -0.08, 0, Math.PI * 2);
  ctx.stroke(); ctx.shadowBlur = 0;
  ctx.restore();

  // ── 기수 레이더 레돔 ─────────────────────────────────
  ctx.shadowBlur = 10 * pulse; ctx.shadowColor = '#e879f9';
  ctx.fillStyle = `rgba(232,121,249,${0.55 + 0.45 * pulse})`;
  ctx.beginPath(); ctx.arc(26.5, 0, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

  ctx.restore();
}

// ── 미사일 (우→좌 고속 이동) ─────────────────────────────
function rMissile(ctx: CanvasRenderingContext2D, o: Obj, ts: number) {
  const p = 0.6 + 0.4 * Math.sin(ts * 0.014 + o.x * 0.02);
  ctx.save(); ctx.translate(o.x, o.cy);
  // 배기 불꽃 (오른쪽)
  const fLen = 10 + Math.sin(ts * 0.04) * 5;
  const fg = ctx.createLinearGradient(10, 0, 10 + fLen, 0);
  fg.addColorStop(0, `rgba(249,115,22,${p})`);
  fg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.shadowBlur = 12; ctx.shadowColor = '#f97316';
  ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(10 + fLen, 0);
  ctx.strokeStyle = fg; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.stroke();
  ctx.shadowBlur = 0;
  // 기체
  ctx.shadowBlur = 14; ctx.shadowColor = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(-14, 0);
  ctx.bezierCurveTo(-10, -4, 4, -4, 10, -3);
  ctx.lineTo(10, 3);
  ctx.bezierCurveTo(4, 4, -10, 4, -14, 0);
  ctx.closePath();
  ctx.fillStyle = '#2a0000'; ctx.fill();
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.shadowBlur = 0;
  // 기수
  ctx.beginPath();
  ctx.moveTo(-14, 0); ctx.lineTo(-20, 0); ctx.lineTo(-17, -3); ctx.lineTo(-14, -3);
  ctx.closePath(); ctx.fillStyle = '#fca5a5'; ctx.fill();
  // 경고등
  const wl = 0.4 + 0.6 * Math.sin(ts * 0.025);
  ctx.shadowBlur = 10*wl; ctx.shadowColor = '#ef4444';
  ctx.fillStyle = `rgba(239,68,68,${wl})`;
  ctx.beginPath(); ctx.arc(-8, -4, 2.5, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function rMine(ctx: CanvasRenderingContext2D, o: Obj, ts: number) {
  const rot = ts * 0.0012;
  const p = 0.5 + 0.5 * Math.sin(ts * 0.005 + o.x * 0.02);
  ctx.save(); ctx.translate(o.x, o.cy); ctx.rotate(rot);
  ctx.shadowBlur = 10; ctx.shadowColor = '#f97316';
  ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a)*o.r, Math.sin(a)*o.r);
    ctx.lineTo(Math.cos(a)*(o.r+9), Math.sin(a)*(o.r+9));
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  ctx.shadowBlur = 14; ctx.shadowColor = '#ea580c';
  ctx.beginPath(); ctx.arc(0, 0, o.r, 0, Math.PI*2);
  ctx.fillStyle = '#1c0800'; ctx.fill();
  ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(0, 0, o.r*0.42, 0, Math.PI*2);
  ctx.fillStyle = `rgba(251,146,60,${0.25+0.35*p})`; ctx.fill();
  ctx.restore();
}

function rGround(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#080619'; ctx.fillRect(0, H-GH, W, GH);
  ctx.shadowBlur = 8; ctx.shadowColor = '#7c3aed';
  ctx.fillStyle = '#7c3aed'; ctx.fillRect(0, H-GH, W, 2);
  ctx.shadowBlur = 0;
}

function hitTest(by: number, objs: Obj[]): boolean {
  if (by - 10 <= 0 || by + 10 >= H - GH) return true;
  for (const o of objs) {
    if (o.kind === 'missile') {
      if (Math.hypot(BX - o.x, by - o.cy) < 10 + o.r) return true;
    } else if (o.kind === 'mine') {
      if (Math.hypot(BX - o.x, by - o.cy) < 10 + o.r) return true;
    }
  }
  return false;
}

// ══ 컴포넌트 ════════════════════════════════════════════

export default function FlappyGame({ onGameEnd, onScoreChange, onAction, onCombo }: GameComponentProps) {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const cityLayersRef  = useRef<CityLayer[]>([]);
  const byRef          = useRef(H / 2);   // bird y
  const velRef     = useRef(0);
  const objsRef    = useRef<Obj[]>([]);
  const scoreRef   = useRef(0);
  const statRef    = useRef<GameStatus>('idle');
  const spawnRef   = useRef(0);
  const upRef      = useRef(false);
  const downRef    = useRef(false);
  const rollEndRef = useRef(0);   // 급선회 충격파 효과 종료 시각 (performance.now)
  const rollCdRef  = useRef(0);   // 급선회 쿨다운 종료 시각
  const trailRef   = useRef<number[]>([]);
  const scRef      = useRef(0);       // scroll

  const [stat,         setStat]        = useState<GameStatus>('idle');
  const [displayScore, setDisplayScore] = useState(0);
  const [flashActive,  setFlashActive]  = useState(false);
  const [flashColor,   setFlashColor]   = useState('rgba(239,68,68,0.35)');
  const { shakeStyle, triggerShake } = useScreenShake();
  const shakeRef = useRef(triggerShake);
  shakeRef.current = triggerShake;

  const onActionRef = useRef(onAction);
  onActionRef.current = onAction;
  const onComboRef = useRef(onCombo);
  onComboRef.current = onCombo;

  const { playJump } = useSound();
  const combo = useCombo();

  // CSS 스케일링 방식: canvas 내부 좌표계는 W x H 고정, CSS width/height로 크기 조정
  const size = useGameSize({ aspectRatio: W / H, maxWidth: 400, maxHeight: 840 });

  const spawnObj = useCallback((): Obj => {
    const sc = scoreRef.current;
    const rand = Math.random();
    const playH = H - GH;
    // 점수 올수록 미사일 비중 증가 (3점부터 등장)
    const mslPct = sc >= 3 ? Math.min(0.45, 0.08 + (sc - 3) * 0.04) : 0;

    if (rand < mslPct) {
      return {
        x: W + 10, kind: 'missile',
        cy: 40 + Math.random() * (playH - 80),
        vy: 0, r: 8, passed: false,
      };
    }
    // 기본: 지뢰 (크기/속도 점수에 따라 증가)
    const spd = (0.8 + Math.random() * 1.6) * (1 + sc * 0.025);
    return {
      x: W + 10, kind: 'mine',
      cy: 65 + Math.random() * (playH - 130),
      vy: (Math.random() < 0.5 ? 1 : -1) * spd,
      r: 17 + Math.random() * 14, passed: false,
    };
  }, []);

  const draw = useCallback((ts: number) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

    const playing = statRef.current === 'playing';
    scRef.current += playing ? 1.0 : 0.12;
    const sc = scRef.current;

    drawCityBg(ctx, cityLayersRef.current, sc);
    rStars(ctx, sc);
    rLines(ctx, sc, playing);
    rGrid(ctx, sc);

    if (playing) {
      if (ts - spawnRef.current > SPAWN_MS) {
        spawnRef.current = ts;
        objsRef.current.push(spawnObj());
      }
      if (upRef.current) {
        velRef.current = Math.max(velRef.current - LIFT, MAX_UP);
      } else if (downRef.current) {
        velRef.current = Math.min(velRef.current + LIFT * 0.88, MAX_DOWN);
      } else {
        velRef.current = Math.min(velRef.current + GRAVITY, MAX_DOWN);
      }
      velRef.current *= DAMPEN;
      byRef.current  += velRef.current;

      for (const o of objsRef.current) {
        o.x += o.kind === 'missile' ? MSL_SPD : SPD;
        if (o.kind === 'mine') {
          o.cy += o.vy;
          const mn = 28 + o.r, mx = H - GH - o.r - 8;
          if (o.cy < mn || o.cy > mx) o.vy *= -1;
        }
      }
      objsRef.current = objsRef.current.filter(o => o.x + o.r + 24 > -10);

      trailRef.current.push(byRef.current);
      if (trailRef.current.length > TRAIL_LEN) trailRef.current.shift();

      for (const o of objsRef.current) {
        const edge = o.x + o.r;
        if (!o.passed && edge < BX - 13) {
          o.passed = true; scoreRef.current++;
          setDisplayScore(scoreRef.current);
          onScoreChange(scoreRef.current * 10);
          setFlashColor('rgba(99,102,241,0.18)'); setFlashActive(true);

          const prevLevel = combo.comboLevel;
          const newLevel = combo.increment();
          if (newLevel > 0 && newLevel > prevLevel) {
            onComboRef.current?.(newLevel);
          }
        }
      }

      if (hitTest(byRef.current, objsRef.current)) {
        statRef.current = 'gameover'; setStat('gameover');
        combo.reset();
        onGameEnd(scoreRef.current * 10);
        shakeRef.current(10, 500);
        setFlashColor('rgba(239,68,68,0.38)'); setFlashActive(true);
        objsRef.current.forEach(o => {
          if (o.kind === 'missile') rMissile(ctx, o, ts);
          else                      rMine(ctx, o, ts);
        });
        rGround(ctx); rTrail(ctx, trailRef.current, ts); rBird(ctx, byRef.current, velRef.current, ts, upRef.current, downRef.current, 0);
        drawVignette(ctx); drawScanlines(ctx);
        return;
      }
    }

    const rollPct = ts < rollEndRef.current ? (rollEndRef.current - ts) / ROLL_DUR : 0;
    objsRef.current.forEach(o => {
      if (o.kind === 'missile') rMissile(ctx, o, ts);
      else                      rMine(ctx, o, ts);
    });
    rGround(ctx);
    rTrail(ctx, trailRef.current, ts);
    rBird(ctx, byRef.current, velRef.current, ts, upRef.current, downRef.current, rollPct);

    ctx.save();
    ctx.shadowBlur = 14; ctx.shadowColor = '#a5f3fc';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 28px "Courier New",monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(scoreRef.current), W / 2, 42);
    ctx.restore();

    if (statRef.current === 'idle') {
      ctx.fillStyle = 'rgba(3,3,11,0.72)'; ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.shadowBlur = 24; ctx.shadowColor = '#a78bfa';
      ctx.fillStyle = '#ede9fe'; ctx.font = 'bold 30px "Courier New",monospace';
      ctx.textAlign = 'center'; ctx.fillText('FLAPPY', W/2, H/2 - 14);
      ctx.restore();
      ctx.save();
      ctx.fillStyle = 'rgba(165,243,252,0.5)';
      ctx.font = '11.5px "Courier New",monospace';
      ctx.textAlign = 'center';
      ctx.fillText('↑/A 상승  ↓/B 하강  Space 급선회', W/2, H/2 + 14);
      ctx.restore();
    }

    drawVignette(ctx);
    drawScanlines(ctx);

  }, [spawnObj, onGameEnd, onScoreChange, combo]);

  useGameLoop(draw, stat !== 'gameover');

  const startGame = useCallback(() => {
    if (statRef.current !== 'idle') return;
    statRef.current = 'playing'; setStat('playing');
    byRef.current = H/2; velRef.current = 0;
    objsRef.current = []; trailRef.current = [];
    scoreRef.current = 0; setDisplayScore(0);
    spawnRef.current = performance.now();
    onActionRef.current?.();
  }, []);

  const restart = useCallback(() => {
    combo.reset();
    upRef.current = false; downRef.current = false;
    rollEndRef.current = 0; rollCdRef.current = 0;
    trailRef.current = [];
    statRef.current = 'idle'; setStat('idle');
    byRef.current = H/2; velRef.current = 0;
    objsRef.current = []; scoreRef.current = 0; setDisplayScore(0);
  }, [combo]);

  const handleUp = useCallback(() => {
    if (!upRef.current) playJump();
    upRef.current = true;
    startGame();
  }, [playJump, startGame]);

  const handleUpRelease   = useCallback(() => { upRef.current   = false; }, []);
  const handleDown        = useCallback(() => { downRef.current = true;  }, []);
  const handleDownRelease = useCallback(() => { downRef.current = false; }, []);

  useEffect(() => {
    cityLayersRef.current = [
      makeCityLayer(0.07, 100, 260, '#080812', 0.05),
      makeCityLayer(0.16,  60, 180, '#090916', 0.11),
      makeCityLayer(0.30,  35, 120, '#0b0b1e', 0.20),
      makeCityLayer(0.55,  20,  70, '#0d0d22', 0.32),
    ];
  }, []);

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        const now = performance.now();
        if (statRef.current === 'playing' && now > rollCdRef.current) {
          // 급선회: 현재 방향으로 속도를 즉시 최대치로 당김
          if (upRef.current)        velRef.current = MAX_UP;
          else if (downRef.current) velRef.current = MAX_DOWN * 0.85;
          else                      velRef.current = MAX_UP * 0.7;
          rollEndRef.current = now + ROLL_DUR; // 충격파 링 시각 효과
          rollCdRef.current  = now + ROLL_CD;
        }
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!upRef.current) { playJump(); upRef.current = true; startGame(); }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        downRef.current = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp')   upRef.current   = false;
      if (e.key === 'ArrowDown') downRef.current = false;
    };
    document.addEventListener('keydown', dn);
    document.addEventListener('keyup',   up);
    return () => { document.removeEventListener('keydown', dn); document.removeEventListener('keyup', up); };
  }, [startGame, playJump]);

  const canvasStyle = size.ready
    ? { width: size.width, height: size.height }
    : {};

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="relative select-none" style={shakeStyle}>
        {/* canvas 내부 좌표계 W x H 고정, CSS로 크기 조정 */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            style={{
              ...canvasStyle,
              border: '1px solid rgba(109,40,217,0.28)',
              background: '#03030b',
              display: 'block',
            }}
            className="rounded-2xl"
          />
          <FlashOverlay active={flashActive} color={flashColor} duration={380} onDone={() => setFlashActive(false)} />
          {stat === 'gameover' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl gap-2"
                 style={{ background: 'rgba(3,3,11,0.84)' }}>
              <p className="text-violet-300 text-xl font-bold tracking-[0.22em] font-mono">GAME OVER</p>
              <p className="text-white/40 text-sm font-mono mt-1">score  {displayScore * 10}</p>
              <button onClick={restart}
                className="mt-3 px-8 py-2 rounded-lg text-sm font-mono tracking-widest text-white"
                style={{ background: 'rgba(109,40,217,0.72)', border: '1px solid rgba(167,139,250,0.38)' }}>
                RETRY
              </button>
            </div>
          )}
        </div>
      </div>

      <GameOverlayController
        type="dpad"
        hiddenActions={['X', 'Y']}
        onActionBtn={(btn) => {
          if (btn === 'A') handleUp();
          if (btn === 'B') handleDown();
        }}
        onActionBtnRelease={(btn) => {
          if (btn === 'A') handleUpRelease();
          if (btn === 'B') handleDownRelease();
        }}
        disabled={stat === 'gameover'}
      />

      <p className="text-zinc-600 text-xs font-mono">A = 위  ·  B = 아래  ·  ↑↓ 키</p>
    </div>
  );
}
