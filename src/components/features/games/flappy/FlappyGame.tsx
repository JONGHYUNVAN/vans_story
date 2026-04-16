'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
import { useSound } from '@/hooks/useSound';
import { useCombo } from '@/hooks/useCombo';
import { useScreenShake } from '@/hooks/useScreenShake';
import { useGameSize } from '@/hooks/useGameSize';
import FlashOverlay from '@/components/features/games/effects/FlashOverlay';
import GameOverlayController from '@/components/features/games/GameOverlayController';

// ── 상수 ────────────────────────────────────────────────
const W  = 320, H = 480;
const GRAVITY = 0.11, LIFT = 0.30, DAMPEN = 0.983;
const MAX_UP = -6.5, MAX_DOWN = 7.5;
const GATE_W = 44;
const ZAP_W  = 82;     // 수평 레이저 폭
const SPD     = -5;    // 기본 오브젝트 속도
const ZAP_SPD = -9.5;  // 레이저 속도 (더 빠름)
const GH  = 22;        // 바닥 높이
const BX  = 80;        // 새 X
const SPAWN_MS  = 1050;
const TRAIL_LEN = 30;
const TRAIL_DX  = 5.2; // 꼬리 점당 수평 간격

// ── 정적 데이터 (모듈 1회) ───────────────────────────────
const mkStars = (n: number, mr: number, ma: number) =>
  Array.from({ length: n }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * mr + 0.2, a: Math.random() * ma + 0.08,
  }));
const L1 = mkStars(52, 0.7, 0.35);
const L2 = mkStars(28, 1.2, 0.60);
const L3 = mkStars(12, 1.9, 0.90);

const SLINES = Array.from({ length: 32 }, () => ({
  sx:  Math.random() * W * 2.5,
  y:   Math.random() * H * 0.94,
  len: 30 + Math.random() * 70,
  spd: 2.8 + Math.random() * 3.8,
  a:   0.06 + Math.random() * 0.22,
}));

// ── 타입 ─────────────────────────────────────────────────
type GameStatus = 'idle' | 'playing' | 'gameover';
// top=천장스파이크, bot=바닥스파이크, mine=움직이는지뢰, portal=원형홀벽, zap=수평레이저
type ObjKind = 'top' | 'bot' | 'mine' | 'portal' | 'zap';
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

function rTrail(ctx: CanvasRenderingContext2D, trail: number[]) {
  if (trail.length < 3) return;
  const tx = BX - (trail.length - 1) * TRAIL_DX;
  ctx.save();
  const g1 = ctx.createLinearGradient(tx, 0, BX, 0);
  g1.addColorStop(0,   'rgba(14,165,233,0)');
  g1.addColorStop(0.5, 'rgba(56,189,248,0.35)');
  g1.addColorStop(1,   'rgba(125,211,252,0.9)');
  ctx.beginPath();
  trail.forEach((y, i) => {
    const x = BX - (trail.length - 1 - i) * TRAIL_DX;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = g1; ctx.lineWidth = 9;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowBlur = 18; ctx.shadowColor = '#0ea5e9'; ctx.stroke();
  const g2 = ctx.createLinearGradient(tx, 0, BX, 0);
  g2.addColorStop(0, 'rgba(255,255,255,0)');
  g2.addColorStop(1, 'rgba(255,255,255,0.92)');
  ctx.beginPath();
  trail.forEach((y, i) => {
    const x = BX - (trail.length - 1 - i) * TRAIL_DX;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = g2; ctx.lineWidth = 2.5; ctx.shadowBlur = 0; ctx.stroke();
  ctx.restore();
}

function rBird(ctx: CanvasRenderingContext2D, y: number, vel: number) {
  const tilt = Math.max(-0.55, Math.min(0.65, vel * 0.065));
  ctx.save(); ctx.translate(BX, y); ctx.rotate(tilt);
  ctx.shadowBlur = 24; ctx.shadowColor = '#7dd3fc';
  ctx.beginPath(); ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#f0f9ff'; ctx.fill();
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.8; ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(6, -3, 3.2, 0, Math.PI * 2); ctx.fillStyle = '#0c4a6e'; ctx.fill();
  ctx.beginPath(); ctx.arc(7.2, -4, 1.2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(15, -1); ctx.lineTo(21, -2.5); ctx.lineTo(21, 3);
  ctx.closePath(); ctx.fillStyle = '#fb923c'; ctx.fill();
  ctx.restore();
}

// ── 천장 스파이크 (cy = 천장에서 내려오는 길이) ──────────
function rTop(ctx: CanvasRenderingContext2D, o: Obj, ts: number) {
  const p = 0.55 + 0.45 * Math.sin(ts * 0.004 + o.x * 0.018);
  ctx.fillStyle = 'rgba(9,7,28,0.94)';
  ctx.fillRect(o.x, 0, GATE_W, o.cy);
  ctx.strokeStyle = 'rgba(109,40,217,0.4)'; ctx.lineWidth = 1;
  ctx.strokeRect(o.x+.5, .5, GATE_W-1, o.cy-.5);
  ctx.save(); ctx.strokeStyle = 'rgba(109,40,217,0.12)'; ctx.lineWidth = 0.6;
  for (let y = 14; y < o.cy-6; y += 14) { ctx.beginPath(); ctx.moveTo(o.x+6, y); ctx.lineTo(o.x+GATE_W-6, y); ctx.stroke(); }
  ctx.restore();
  ctx.shadowBlur = 16*p; ctx.shadowColor = '#e879f9';
  ctx.fillStyle = `rgba(232,121,249,${0.88*p})`;
  ctx.fillRect(o.x, o.cy-3, GATE_W, 3); ctx.shadowBlur = 0;
  ctx.shadowBlur = 12*p; ctx.shadowColor = '#e879f9'; ctx.fillStyle = '#f0abfc';
  ctx.beginPath(); ctx.arc(o.x+GATE_W/2, o.cy-1.5, 4.5, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;
}

// ── 바닥 스파이크 (cy = 바닥에서 올라오는 길이) ──────────
function rBot(ctx: CanvasRenderingContext2D, o: Obj, ts: number) {
  const sy = H - GH - o.cy; // 스파이크 시작 y
  const p  = 0.55 + 0.45 * Math.sin(ts * 0.004 + o.x * 0.018);
  ctx.fillStyle = 'rgba(9,7,28,0.94)';
  ctx.fillRect(o.x, sy, GATE_W, o.cy);
  ctx.strokeStyle = 'rgba(109,40,217,0.4)'; ctx.lineWidth = 1;
  ctx.strokeRect(o.x+.5, sy+.5, GATE_W-1, o.cy-.5);
  ctx.save(); ctx.strokeStyle = 'rgba(109,40,217,0.12)'; ctx.lineWidth = 0.6;
  for (let y = sy+10; y < H-GH-6; y += 14) { ctx.beginPath(); ctx.moveTo(o.x+6, y); ctx.lineTo(o.x+GATE_W-6, y); ctx.stroke(); }
  ctx.restore();
  ctx.shadowBlur = 16*p; ctx.shadowColor = '#e879f9';
  ctx.fillStyle = `rgba(232,121,249,${0.88*p})`;
  ctx.fillRect(o.x, sy, GATE_W, 3); ctx.shadowBlur = 0;
  ctx.shadowBlur = 12*p; ctx.shadowColor = '#e879f9'; ctx.fillStyle = '#f0abfc';
  ctx.beginPath(); ctx.arc(o.x+GATE_W/2, sy+1.5, 4.5, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;
}

// ── 원형 포탈 벽 (cy = 홀 중심 y, r = 반지름) ──────────
function rPortal(ctx: CanvasRenderingContext2D, o: Obj, ts: number) {
  const bH = H - GH, hx = o.x + GATE_W / 2;
  const p  = 0.6 + 0.4 * Math.sin(ts * 0.003 + o.x * 0.015);
  // 홀이 뚫린 벽 (evenodd)
  ctx.save();
  ctx.beginPath();
  ctx.rect(o.x, 0, GATE_W, bH);
  ctx.arc(hx, o.cy, o.r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(9,7,28,0.94)';
  ctx.fill('evenodd');
  ctx.strokeStyle = 'rgba(109,40,217,0.4)'; ctx.lineWidth = 1;
  ctx.strokeRect(o.x+.5, .5, GATE_W-1, bH-.5);
  ctx.restore();
  // 포탈 링 글로우
  ctx.shadowBlur = 22*p; ctx.shadowColor = '#818cf8';
  ctx.strokeStyle = `rgba(165,180,252,${p})`; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(hx, o.cy, o.r, 0, Math.PI*2); ctx.stroke();
  ctx.shadowBlur = 0;
  // 내부 방사형 글로우
  const ig = ctx.createRadialGradient(hx, o.cy, 0, hx, o.cy, o.r);
  ig.addColorStop(0, `rgba(99,102,241,${0.14*p})`);
  ig.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(hx, o.cy, o.r, 0, Math.PI*2);
  ctx.fillStyle = ig; ctx.fill();
}

// ── 수평 레이저 빔 (cy = y 위치) ─────────────────────────
function rZap(ctx: CanvasRenderingContext2D, o: Obj, ts: number) {
  const p = 0.6 + 0.4 * Math.sin(ts * 0.007 + o.x * 0.03);
  ctx.save();
  ctx.shadowBlur = 18*p; ctx.shadowColor = '#38bdf8';
  const g = ctx.createLinearGradient(o.x, 0, o.x + ZAP_W, 0);
  g.addColorStop(0,    'rgba(56,189,248,0)');
  g.addColorStop(0.15, `rgba(56,189,248,${p})`);
  g.addColorStop(0.85, `rgba(56,189,248,${p})`);
  g.addColorStop(1,    'rgba(56,189,248,0)');
  ctx.beginPath(); ctx.moveTo(o.x, o.cy); ctx.lineTo(o.x+ZAP_W, o.cy);
  ctx.strokeStyle = g; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
  ctx.strokeStyle = `rgba(255,255,255,${p*0.85})`; ctx.lineWidth = 1.8;
  ctx.shadowBlur = 0; ctx.stroke();
  ctx.fillStyle = '#7dd3fc'; ctx.shadowBlur = 8; ctx.shadowColor = '#38bdf8';
  ctx.beginPath(); ctx.arc(o.x,       o.cy, 5, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(o.x+ZAP_W, o.cy, 5, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0; ctx.restore();
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
    if (o.kind === 'top') {
      if (BX+13 > o.x+2 && BX-13 < o.x+GATE_W-2)
        if (by - 10 < o.cy) return true;
    } else if (o.kind === 'bot') {
      if (BX+13 > o.x+2 && BX-13 < o.x+GATE_W-2)
        if (by + 10 > H - GH - o.cy) return true;
    } else if (o.kind === 'mine') {
      if (Math.hypot(BX - o.x, by - o.cy) < 10 + o.r) return true;
    } else if (o.kind === 'portal') {
      if (BX+13 > o.x+2 && BX-13 < o.x+GATE_W-2)
        if (Math.hypot(BX - (o.x + GATE_W/2), by - o.cy) > o.r - 10) return true;
    } else if (o.kind === 'zap') {
      if (BX+10 > o.x && BX-10 < o.x+ZAP_W)
        if (Math.abs(by - o.cy) < 8) return true;
    }
  }
  return false;
}

// ══ 컴포넌트 ════════════════════════════════════════════

export default function FlappyGame({ onGameEnd, onScoreChange, onAction, onCombo }: GameComponentProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const byRef      = useRef(H / 2);   // bird y
  const velRef     = useRef(0);
  const objsRef    = useRef<Obj[]>([]);
  const scoreRef   = useRef(0);
  const statRef    = useRef<GameStatus>('idle');
  const animRef    = useRef(0);
  const spawnRef   = useRef(0);
  const holdRef    = useRef(false);
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
  const size = useGameSize({ aspectRatio: W / H, maxWidth: 400, maxHeight: 680 });

  const spawnObj = useCallback((): Obj => {
    const sc = scoreRef.current;
    const rand = Math.random();
    const minePct   = Math.min(0.28, 0.05 + sc * 0.022);
    const portalPct = sc >= 3  ? Math.min(0.18, 0.03 + (sc - 3)  * 0.018) : 0;
    const zapPct    = sc >= 5  ? Math.min(0.18, 0.03 + (sc - 5)  * 0.018) : 0;
    const playH = H - GH;

    if (rand < minePct) {
      const spd = (0.9 + Math.random() * 1.7) * (1 + sc * 0.025);
      return {
        x: W + 10, kind: 'mine',
        cy: 65 + Math.random() * (playH - 130),
        vy: (Math.random() < 0.5 ? 1 : -1) * spd,
        r: 17 + Math.random() * 14, passed: false,
      };
    }
    if (rand < minePct + portalPct) {
      return {
        x: W + 10, kind: 'portal',
        cy: 90 + Math.random() * (playH - 180),
        vy: 0, r: 46 + Math.random() * 18, passed: false,
      };
    }
    if (rand < minePct + portalPct + zapPct) {
      return {
        x: W + 10, kind: 'zap',
        cy: 80 + Math.random() * (playH - 160),
        vy: 0, r: 0, passed: false,
      };
    }
    // top 또는 bot 단일 기둥
    return {
      x: W + 10, kind: Math.random() < 0.5 ? 'top' : 'bot',
      cy: 70 + Math.random() * 140,
      vy: 0, r: 0, passed: false,
    };
  }, []);

  const draw = useCallback((ts: number) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

    const playing = statRef.current === 'playing';
    scRef.current += playing ? 1.0 : 0.12;
    const sc = scRef.current;

    ctx.fillStyle = '#03030b'; ctx.fillRect(0, 0, W, H);
    rStars(ctx, sc);
    rLines(ctx, sc, playing);
    rGrid(ctx, sc);

    if (playing) {
      if (ts - spawnRef.current > SPAWN_MS) {
        spawnRef.current = ts;
        objsRef.current.push(spawnObj());
      }
      velRef.current = holdRef.current
        ? Math.max(velRef.current - LIFT, MAX_UP)
        : Math.min(velRef.current + GRAVITY, MAX_DOWN);
      velRef.current *= DAMPEN;
      byRef.current  += velRef.current;

      for (const o of objsRef.current) {
        o.x += o.kind === 'zap' ? ZAP_SPD : SPD;
        if (o.kind === 'mine') {
          o.cy += o.vy;
          const mn = 28 + o.r, mx = H - GH - o.r - 8;
          if (o.cy < mn || o.cy > mx) o.vy *= -1;
        }
      }
      objsRef.current = objsRef.current.filter(o => {
        if (o.kind === 'mine')   return o.x + o.r + 12 > -10;
        if (o.kind === 'zap')    return o.x + ZAP_W    > -10;
        return o.x + GATE_W > -10; // top / bot / portal
      });

      trailRef.current.push(byRef.current);
      if (trailRef.current.length > TRAIL_LEN) trailRef.current.shift();

      for (const o of objsRef.current) {
        const edge = o.kind === 'mine'   ? o.x + o.r
                   : o.kind === 'zap'    ? o.x + ZAP_W
                   : o.x + GATE_W; // top / bot / portal
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
          if      (o.kind === 'top')    rTop(ctx, o, ts);
          else if (o.kind === 'bot')    rBot(ctx, o, ts);
          else if (o.kind === 'portal') rPortal(ctx, o, ts);
          else if (o.kind === 'zap')    rZap(ctx, o, ts);
          else                          rMine(ctx, o, ts);
        });
        rGround(ctx); rTrail(ctx, trailRef.current); rBird(ctx, byRef.current, velRef.current);
        return;
      }
    }

    objsRef.current.forEach(o => {
          if      (o.kind === 'top')    rTop(ctx, o, ts);
          else if (o.kind === 'bot')    rBot(ctx, o, ts);
          else if (o.kind === 'portal') rPortal(ctx, o, ts);
          else if (o.kind === 'zap')    rZap(ctx, o, ts);
          else                          rMine(ctx, o, ts);
        });
    rGround(ctx);
    rTrail(ctx, trailRef.current);
    rBird(ctx, byRef.current, velRef.current);

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
      ctx.fillText('hold to rise  ·  release to fall', W/2, H/2 + 14);
      ctx.restore();
    }

    if (statRef.current !== 'gameover') animRef.current = requestAnimationFrame(draw);
  }, [spawnObj, onGameEnd, onScoreChange, combo]);

  const startGame = useCallback(() => {
    if (statRef.current !== 'idle') return;
    statRef.current = 'playing'; setStat('playing');
    byRef.current = H/2; velRef.current = 0;
    objsRef.current = []; trailRef.current = [];
    scoreRef.current = 0; setDisplayScore(0);
    spawnRef.current = performance.now();
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(draw);
    onActionRef.current?.();
  }, [draw]);

  const restart = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    combo.reset();
    holdRef.current = false; trailRef.current = [];
    statRef.current = 'idle'; setStat('idle');
    byRef.current = H/2; velRef.current = 0;
    objsRef.current = []; scoreRef.current = 0; setDisplayScore(0);
    animRef.current = requestAnimationFrame(draw);
  }, [draw, combo]);

  const handleTap = useCallback(() => {
    if (!holdRef.current) playJump();
    holdRef.current = true;
    startGame();
  }, [playJump, startGame]);

  const handleTapRelease = useCallback(() => {
    holdRef.current = false;
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!holdRef.current) {
          playJump();
          holdRef.current = true;
          startGame();
        }
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') holdRef.current = false;
    };
    document.addEventListener('keydown', dn);
    document.addEventListener('keyup', up);
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
            className="rounded-2xl cursor-pointer"
            onMouseDown={() => {
              if (!holdRef.current) playJump();
              holdRef.current = true;
              startGame();
            }}
            onMouseUp={()   => { holdRef.current = false; }}
            onMouseLeave={() => { holdRef.current = false; }}
            onTouchStart={e => {
              e.preventDefault();
              if (!holdRef.current) playJump();
              holdRef.current = true;
              startGame();
            }}
            onTouchEnd={() =>  { holdRef.current = false; }}
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
        hiddenActions={['B', 'X', 'Y']}
        onActionBtn={(btn) => { if (btn === 'A') handleTap(); }}
        onActionBtnRelease={(btn) => { if (btn === 'A') handleTapRelease(); }}
        disabled={stat === 'gameover'}
      />

      <p className="text-zinc-600 text-xs font-mono">hold space / click / A버튼 · fly up</p>
    </div>
  );
}
