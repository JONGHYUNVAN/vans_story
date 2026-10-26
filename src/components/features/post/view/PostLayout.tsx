'use client';

import type { ReactNode } from 'react';
import { POST_LAYOUT_ICON_OVERRIDES, POST_THEMES, type PostThemeKey } from '@/constants/postThemes';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PostLayoutProps {
  /** 테마 객체에는 아이콘 함수가 있어 서버→클라이언트로 넘길 수 없으므로 키로 받아 조회한다 */
  themeKey: PostThemeKey;
  children: ReactNode;
  title?: string;
  /** 에디터 미리보기: 전체 높이 대신 내용 높이, 일부 테마는 영상을 끈다 */
  isPreview?: boolean;
}

/**
 * 카테고리 포스트 페이지의 공통 틀. 배경(색·패턴·회전 그라데이션·영상)과 헤더는 테마에서 온다.
 */
export default function PostLayout({
  themeKey,
  children,
  title,
  isPreview = false,
}: PostLayoutProps) {
  const theme = POST_THEMES[themeKey];
  const { layout } = theme;
  const Icon = POST_LAYOUT_ICON_OVERRIDES[theme.key] ?? theme.icon;
  const reducedMotion = useReducedMotion();
  // 미리보기(일부 테마)와 OS '동작 줄이기'에서는 영상을 내리지 않는다
  const video =
    layout.video && !(isPreview && layout.video.hideInPreview) && !reducedMotion
      ? layout.video
      : null;
  const heightClass = isPreview ? 'h-auto min-h-[300px]' : 'min-h-screen';

  return (
    <div
      className={`relative overflow-hidden ${isPreview ? 'h-auto' : 'min-h-screen'} ${layout.baseClass}`}
    >
      {layout.pattern && (
        <div
          className={`absolute inset-0 z-1 ${layout.pattern.opacityClass ?? ''}`}
          style={{
            backgroundImage: layout.pattern.image,
            backgroundSize: layout.pattern.size,
            backgroundPosition: layout.pattern.position,
          }}
        />
      )}

      {layout.spinGradient && (
        <div className="absolute inset-0 z-1">
          <div
            className="animate-spin-slow absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-radial from-(--spin) via-transparent to-transparent"
            style={{ animationDuration: '15s', ['--spin' as string]: `${layout.spinGradient}08` }}
          />
          <div
            className="animate-spin-slow absolute -right-1/2 -bottom-1/2 h-full w-full bg-gradient-radial from-(--spin) via-transparent to-transparent"
            style={{
              animationDuration: '20s',
              animationDirection: 'reverse',
              ['--spin' as string]: `${layout.spinGradient}05`,
            }}
          />
        </div>
      )}

      {layout.glow && (
        <div className="absolute inset-0 z-1">
          <div
            className="absolute top-1/4 left-1/4 h-1/2 w-1/2 animate-pulse blur-[100px]"
            style={{ animationDuration: '4s', backgroundColor: `${layout.glow}08` }}
          />
          <div
            className="absolute right-1/4 bottom-1/4 h-1/2 w-1/2 animate-pulse blur-[120px]"
            style={{ animationDuration: '6s', backgroundColor: `${layout.glow}05` }}
          />
        </div>
      )}

      <div className="relative z-2">
        <div
          className={`relative mx-auto max-w-5xl border-x px-6 py-12 ${heightClass} ${layout.borderClass}`}
        >
          {/* 배경 영상 또는 어둡게 처리 */}
          {(video || layout.overlayOnly) && (
            <div className="absolute inset-0 z-[-1]">
              {video?.underlayClass && (
                <div className={`absolute inset-0 ${video.underlayClass}`} />
              )}
              {video && !video.overlayAfterVideo && video.overlayClass && (
                <div className={`absolute inset-0 ${video.overlayClass}`} />
              )}
              {video && (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className={`h-full w-full object-cover ${video.opacityClass}`}
                >
                  <source src={video.src} type="video/webm" />
                </video>
              )}
              {video?.overlayAfterVideo && video.overlayClass && (
                <div className={`absolute inset-0 ${video.overlayClass}`} />
              )}
              {!video && layout.overlayOnly && (
                <div className={`absolute inset-0 ${layout.overlayOnly}`} />
              )}
            </div>
          )}

          {title && (
            <div className={`relative mb-8 border-b pb-8 ${layout.headerBorderClass}`}>
              <div className="flex items-center gap-3">
                <Icon className={layout.iconClass} />
                <h1 className={`text-2xl font-semibold ${layout.titleClass}`}>{title}</h1>
              </div>
            </div>
          )}

          <div className={`relative z-10 ${layout.contentClass}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
