'use client';

import { useState } from 'react';

export type ControllerType = 'dpad' | 'keyboard' | 'none';
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type ActionBtn = 'A' | 'B' | 'X' | 'Y';

export interface GameOverlayControllerProps {
  type: ControllerType;
  onDirection?: (dir: Direction) => void;
  onActionBtn?: (btn: ActionBtn) => void;
  onActionBtnRelease?: (btn: ActionBtn) => void;
  hiddenActions?: ActionBtn[];
  onKey?: (key: string) => void;
  disabled?: boolean;
}

// ── D-패드: SVG 베벨 + 입체감
const DPAD_SIZE = 160;
const DPAD_ARM  = 52;   // 팔 너비
const DPAD_PAD  = (DPAD_SIZE - DPAD_ARM) / 2; // = 54

function DPad({
  onDirection,
  disabled,
}: {
  onDirection?: (dir: Direction) => void;
  disabled?: boolean;
}) {
  const [active, setActive] = useState<Direction | null>(null);
  const S = DPAD_SIZE;
  const p = DPAD_PAD;
  const a = DPAD_ARM;

  const press = (dir: Direction) => (e: React.PointerEvent) => {
    e.preventDefault();
    if (disabled) return;
    setActive(dir);
    onDirection?.(dir);
  };
  const release = () => setActive(null);

  const crossPath = `M${p} 0 H${S-p} V${p} H${S} V${S-p} H${S-p} V${S} H${p} V${S-p} H0 V${p} H${p} Z`;

  return (
    <div
      className="relative select-none touch-none"
      style={{ width: S, height: S }}
    >
      {/* SVG 베이스 */}
      <svg
        viewBox={`0 0 ${S} ${S}`}
        className="absolute inset-0 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="dg" cx="38%" cy="32%" r="70%">
            <stop offset="0%"   stopColor="#52525b" />
            <stop offset="100%" stopColor="#18181b" />
          </radialGradient>
          <radialGradient id="dc" cx="38%" cy="32%" r="70%">
            <stop offset="0%"   stopColor="#27272a" />
            <stop offset="100%" stopColor="#0f0f10" />
          </radialGradient>
          <filter id="ds" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 십자 바디 */}
        <path d={crossPath} fill="url(#dg)" filter="url(#ds)" />

        {/* 상단·좌측 하이라이트 (빛 반사) */}
        <path d={`M${p+1} 1 H${S-p-1} V${p}`}
          fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
        <path d={`M1 ${p+1} V${S-p-1} H${p}`}
          fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />

        {/* 하단·우측 그림자 엣지 */}
        <path d={`M${p} ${S-1} H${S-p} M${S-1} ${p} V${S-p}`}
          fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="2" />

        {/* 내부 구분선 */}
        <line x1={p}   y1={p}   x2={p}   y2={S-p} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1={S-p} y1={p}   x2={S-p} y2={S-p} stroke="rgba(0,0,0,0.3)"       strokeWidth="1" />
        <line x1={p}   y1={p}   x2={S-p} y2={p}   stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1={p}   y1={S-p} x2={S-p} y2={S-p} stroke="rgba(0,0,0,0.3)"       strokeWidth="1" />

        {/* 중앙 원 */}
        <circle cx={S/2} cy={S/2} r="23" fill="url(#dc)" />
        <circle cx={S/2} cy={S/2} r="23" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <circle cx={S/2-4} cy={S/2-4} r="5" fill="rgba(255,255,255,0.05)" />
      </svg>

      {/* 눌렸을 때 팔 highlight */}
      {active && (
        <svg viewBox={`0 0 ${S} ${S}`} className="absolute inset-0 pointer-events-none">
          <path
            d={{
              UP:    `M${p} 0 H${S-p} V${p} H${p} Z`,
              DOWN:  `M${p} ${S-p} H${S-p} V${S} H${p} Z`,
              LEFT:  `M0 ${p} H${p} V${S-p} H0 Z`,
              RIGHT: `M${S-p} ${p} H${S} V${S-p} H${S-p} Z`,
            }[active]}
            fill="rgba(255,255,255,0.12)"
          />
        </svg>
      )}

      {/* 방향 터치 영역 */}
      {(
        [
          { dir: 'UP'    as Direction, style: { top:0,    left:p,   width:a, height:p   }, icon: 'M10 2 L18 14 L2 14 Z',  vb:'0 0 20 16' },
          { dir: 'DOWN'  as Direction, style: { bottom:0, left:p,   width:a, height:p   }, icon: 'M10 14 L2 2 L18 2 Z',   vb:'0 0 20 16' },
          { dir: 'LEFT'  as Direction, style: { top:p,    left:0,   width:p, height:a   }, icon: 'M2 10 L14 2 L14 18 Z',  vb:'0 0 16 20' },
          { dir: 'RIGHT' as Direction, style: { top:p,    right:0,  width:p, height:a   }, icon: 'M14 10 L2 2 L2 18 Z',   vb:'0 0 16 20' },
        ] as const
      ).map(({ dir, style, icon, vb }) => (
        <button
          key={dir}
          onPointerDown={press(dir)}
          onPointerUp={release}
          onPointerLeave={release}
          onPointerCancel={release}
          className="absolute flex items-center justify-center"
          style={style}
          aria-label={dir}
        >
          <svg
            viewBox={vb}
            style={{
              width: 18, height: 18,
              fill: active === dir ? '#ffffff' : 'rgba(255,255,255,0.6)',
              filter: active === dir ? 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' : 'none',
              transition: 'fill 0.08s, filter 0.08s',
            }}
          >
            <path d={icon} />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ── 액션버튼: 구(球) 그라디언트 + 다이아몬드 배치
const BTN_STYLE: Record<ActionBtn, React.CSSProperties> = {
  A: {
    background: 'radial-gradient(circle at 36% 32%, #6ee7b7, #065f46)',
    boxShadow:  '0 0 18px rgba(52,211,153,0.5), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 6px rgba(0,0,0,0.35)',
    border:     '1.5px solid rgba(52,211,153,0.55)',
  },
  B: {
    background: 'radial-gradient(circle at 36% 32%, #fca5a5, #7f1d1d)',
    boxShadow:  '0 0 18px rgba(239,68,68,0.5), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 6px rgba(0,0,0,0.35)',
    border:     '1.5px solid rgba(239,68,68,0.55)',
  },
  X: {
    background: 'radial-gradient(circle at 36% 32%, #93c5fd, #1e3a8a)',
    boxShadow:  '0 0 18px rgba(96,165,250,0.5), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 6px rgba(0,0,0,0.35)',
    border:     '1.5px solid rgba(96,165,250,0.55)',
  },
  Y: {
    background: 'radial-gradient(circle at 36% 32%, #fde68a, #78350f)',
    boxShadow:  '0 0 18px rgba(251,191,36,0.5), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 6px rgba(0,0,0,0.35)',
    border:     '1.5px solid rgba(251,191,36,0.55)',
  },
};

const ACTION_POS: Record<ActionBtn, string> = {
  Y: 'top-0    left-1/2 -translate-x-1/2',
  B: 'right-0  top-1/2  -translate-y-1/2',
  A: 'bottom-0 left-1/2 -translate-x-1/2',
  X: 'left-0   top-1/2  -translate-y-1/2',
};

function ActionButtons({
  onActionBtn,
  onActionBtnRelease,
  hiddenActions,
  disabled,
}: {
  onActionBtn?: (btn: ActionBtn) => void;
  onActionBtnRelease?: (btn: ActionBtn) => void;
  hiddenActions?: ActionBtn[];
  disabled?: boolean;
}) {
  return (
    <div className="relative" style={{ width: DPAD_SIZE, height: DPAD_SIZE }}>
      {/* 다이아몬드 연결선 */}
      <svg viewBox="0 0 160 160" className="absolute inset-0 pointer-events-none opacity-20">
        <line x1="80" y1="28" x2="132" y2="80" stroke="white" strokeWidth="1" />
        <line x1="132" y1="80" x2="80" y2="132" stroke="white" strokeWidth="1" />
        <line x1="80" y1="132" x2="28" y2="80" stroke="white" strokeWidth="1" />
        <line x1="28" y1="80" x2="80" y2="28" stroke="white" strokeWidth="1" />
      </svg>

      {(['Y', 'B', 'A', 'X'] as ActionBtn[]).map(btn => {
        if (hiddenActions?.includes(btn)) return null;
        return (
          <button
            key={btn}
            onPointerDown={e => {
              e.preventDefault();
              if (!disabled) onActionBtn?.(btn);
            }}
            onPointerUp={()     => { if (!disabled) onActionBtnRelease?.(btn); }}
            onPointerCancel={() => { if (!disabled) onActionBtnRelease?.(btn); }}
            onPointerLeave={()  => { if (!disabled) onActionBtnRelease?.(btn); }}
            className={`absolute w-14 h-14 rounded-full text-white font-bold text-sm flex items-center justify-center select-none touch-none transition-[transform,filter] active:scale-90 active:brightness-75 ${ACTION_POS[btn]}`}
            style={BTN_STYLE[btn]}
            aria-label={`버튼 ${btn}`}
          >
            {btn}
          </button>
        );
      })}
    </div>
  );
}

// ── 게임패드 오버레이 바
function GamepadOverlay(props: GameOverlayControllerProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/8 flex items-center justify-between px-6 pb-[env(safe-area-inset-bottom,0px)]"
      style={{
        height: 200,
        background: 'linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.45))',
        backdropFilter: 'blur(16px)',
      }}
    >
      <DPad onDirection={props.onDirection} disabled={props.disabled} />
      <ActionButtons
        onActionBtn={props.onActionBtn}
        onActionBtnRelease={props.onActionBtnRelease}
        hiddenActions={props.hiddenActions}
        disabled={props.disabled}
      />
    </div>
  );
}

// ── 키보드 오버레이
const QWERTY_ROW1 = ['q','w','e','r','t','y','u','i','o','p'];
const QWERTY_ROW2 = ['a','s','d','f','g','h','j','k','l'];
const QWERTY_ROW3 = ['z','x','c','v','b','n','m'];

const KEY_BTN =
  'w-8 h-10 sm:w-9 bg-zinc-700/80 rounded text-white text-xs flex items-center justify-center select-none touch-none active:bg-zinc-500';

function KeyboardOverlay({
  onKey,
  disabled,
}: {
  onKey?: (key: string) => void;
  disabled?: boolean;
}) {
  const handleKey = (key: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    if (!disabled) onKey?.(key);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-2"
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.5))',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex justify-center gap-0.5 mb-0.5">
        {QWERTY_ROW1.map(k => <button key={k} onPointerDown={handleKey(k)} className={KEY_BTN}>{k}</button>)}
      </div>
      <div className="flex justify-center gap-0.5 mb-0.5">
        {QWERTY_ROW2.map(k => <button key={k} onPointerDown={handleKey(k)} className={KEY_BTN}>{k}</button>)}
        <button onPointerDown={handleKey('Backspace')} className="w-12 h-10 bg-zinc-700/80 rounded text-white text-xs flex items-center justify-center select-none touch-none active:bg-zinc-500">⌫</button>
      </div>
      <div className="flex justify-center gap-0.5">
        {QWERTY_ROW3.map(k => <button key={k} onPointerDown={handleKey(k)} className={KEY_BTN}>{k}</button>)}
        <button onPointerDown={handleKey(' ')} className="w-16 h-10 bg-zinc-700/80 rounded text-white text-xs flex items-center justify-center select-none touch-none active:bg-zinc-500" aria-label="스페이스">space</button>
      </div>
    </div>
  );
}

export default function GameOverlayController(props: GameOverlayControllerProps) {
  if (props.type === 'none')     return null;
  if (props.type === 'dpad')     return <GamepadOverlay {...props} />;
  if (props.type === 'keyboard') return <KeyboardOverlay onKey={props.onKey} disabled={props.disabled} />;
  return null;
}
