'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { GameComponentProps } from '@/app/games/[gameId]/GamePageClient';
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

  // 3가닥 난류 배기 (코어 + 상하 와류)
  for (let w = 0; w < 3; w++) {
    const isCore = w === 1;
    const offY   = (w - 1) * 4; // -4, 0, +4

    const g = ctx.createLinearGradient(tx, 0, BX, 0);
    if (isCore) {
      g.addColorStop(0,    'rgba(109,40,217,0)');
      g.addColorStop(0.3,  'rgba(34,211,238,0.44)');
      g.addColorStop(0.75, 'rgba(186,230,253,0.84)');
      g.addColorStop(1,    'rgba(255,255,255,1)');
    } else {
      g.addColorStop(0,   'rgba(76,29,149,0)');
      g.addColorStop(0.5, 'rgba(109,40,217,0.24)');
      g.addColorStop(1,   'rgba(139,92,246,0.52)');
    }

    ctx.beginPath();
    trail.forEach((baseY, i) => {
      const x    = BX - (len - 1 - i) * TRAIL_DX;
      const age  = i / len;
      // 거리에 따라 흩어지는 난류 — 전투기에서 멀수록 더 흔들림
      const turb = Math.sin(i * 1.9 + w * 2.3 + ts * 0.0028) * (1 - age) * 3;
      const y    = baseY + offY * (1 - age) + turb;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });

    ctx.strokeStyle = g;
    ctx.lineWidth   = isCore ? 4.5 : 2;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (isCore) { ctx.shadowBlur = 22; ctx.shadowColor = '#22d3ee'; }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

// ── 전투기 렌더 ─────────────────────────────────────────
function rBird(ctx: CanvasRenderingContext2D, y: number, vel: number, ts: number, upHeld: boolean, downHeld: boolean, rollPct: number) {
  const tilt   = Math.max(-0.44, Math.min(0.62, vel * 0.082));
  const thrust = upHeld || downHeld;
  const exLen  = thrust ? 18 + Math.sin(ts * 0.05) * 8 : 5 + Math.sin(ts * 0.02) * 3;
  const exA    = thrust ? 0.72 + 0.28 * Math.sin(ts * 0.04) : 0.28;
  const exCol  = upHeld ? '#22d3ee' : downHeld ? '#f97316' : '#8b5cf6';
  const wink   = 0.55 + 0.45 * Math.sin(ts * 0.007);

  ctx.save();
  ctx.translate(BX, y);
  ctx.rotate(tilt);

  // ── 급선회 충격파 링 (속도 버스트 시각 피드백) ─────────
  if (rollPct > 0) {
    const rad = 18 + (1 - rollPct) * 32; // 18→50 확장
    ctx.shadowBlur = 36 * rollPct; ctx.shadowColor = '#22d3ee';
    ctx.strokeStyle = `rgba(34,211,238,${rollPct * 0.92})`;
    ctx.lineWidth = 2.5 * rollPct + 0.5;
    ctx.beginPath(); ctx.ellipse(0, 0, rad, rad * 0.48, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // ── 애프터버너 (맨 뒤에 먼저) ────────────────────────
  {
    const eg = ctx.createLinearGradient(-17, 0, -17 - exLen, 0);
    eg.addColorStop(0, upHeld ? `rgba(34,211,238,${exA})`
                   : downHeld ? `rgba(249,115,22,${exA})`
                   :            `rgba(139,92,246,${exA * 0.7})`);
    eg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.shadowBlur = thrust ? 24 : 8; ctx.shadowColor = exCol;
    ctx.beginPath(); ctx.moveTo(-17, 0); ctx.lineTo(-17 - exLen, 0);
    ctx.strokeStyle = eg; ctx.lineWidth = thrust ? 10 : 4;
    ctx.lineCap = 'round'; ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // ── 델타 날개 (위·아래 대칭) ─────────────────────────
  for (const s of [-1, 1] as const) {
    ctx.beginPath();
    ctx.moveTo( 5, s * 2);
    ctx.lineTo(-12, s * 21);   // 날개 끝
    ctx.lineTo(-17, s *  4);   // 날개 후연
    ctx.lineTo(-10, s *  2);
    ctx.closePath();
    ctx.fillStyle = '#11072a';
    ctx.shadowBlur = 8; ctx.shadowColor = '#4c1d95'; ctx.fill();
    ctx.strokeStyle = '#5b21b6'; ctx.lineWidth = 1.1; ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // ── 동체 (유선형) ────────────────────────────────────
  ctx.save();
  ctx.shadowBlur = 18; ctx.shadowColor = '#3b0764';
  ctx.beginPath();
  ctx.moveTo(22,  0);                              // 기수
  ctx.bezierCurveTo(18, -5,  4, -5, -11, -4);     // 등면
  ctx.lineTo(-18, -3); ctx.lineTo(-18, 3);         // 엔진 나셀
  ctx.lineTo(-11,  4);
  ctx.bezierCurveTo( 4,  5, 18,  5, 22,  0);      // 배면
  ctx.closePath();
  ctx.fillStyle = '#0d0620';
  ctx.fill();
  ctx.strokeStyle = '#5b21b6'; ctx.lineWidth = 1.6; ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();

  // ── 수직 꼬리날개 ────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(-11, -4); ctx.lineTo(-15, -15); ctx.lineTo(-18, -4);
  ctx.closePath();
  ctx.fillStyle = '#0f0828';
  ctx.strokeStyle = '#4c1d95'; ctx.lineWidth = 1; ctx.fill(); ctx.stroke();

  // ── 콕핏 캐노피 ──────────────────────────────────────
  ctx.save();
  ctx.beginPath(); ctx.ellipse(9, -3.5, 5.5, 3, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#071224';
  ctx.shadowBlur = 10; ctx.shadowColor = '#22d3ee'; ctx.fill();
  ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 0.9; ctx.stroke();
  ctx.shadowBlur = 0;
  const cg = ctx.createLinearGradient(6, -6, 11, -2);
  cg.addColorStop(0, 'rgba(186,230,253,0.32)');
  cg.addColorStop(1, 'rgba(34,211,238,0.04)');
  ctx.fillStyle = cg; ctx.fill();
  ctx.restore();

  // ── 날개 끝 항법등 ───────────────────────────────────
  ctx.shadowBlur = 12 * wink; ctx.shadowColor = '#22d3ee';
  ctx.fillStyle = `rgba(34,211,238,${0.55 + 0.45 * wink})`;
  ctx.beginPath(); ctx.arc(-12, -21, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-12,  21, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

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
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const byRef      = useRef(H / 2);   // bird y
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

    ctx.fillStyle = '#03030b'; ctx.fillRect(0, 0, W, H);
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
