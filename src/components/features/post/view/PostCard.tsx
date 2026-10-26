'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useRef } from 'react';
import { AiOutlineEye, AiOutlineLike } from 'react-icons/ai';
import { MdSecurity } from 'react-icons/md';
import { SiDocker } from 'react-icons/si';
import { useTranslation } from '@/lib/i18n';
import { POST_THEMES, type PostThemeKey } from '@/constants/postThemes';
import type { PostInfo } from '@/types/post';

export interface PostCardProps {
  themeKey: PostThemeKey;
  post: PostInfo;
  renderBadge?: (post: PostInfo) => ReactNode;
}

const SLIDE_MS = 600;
const DIVIDER_DELAY_MS = 200;
const BOTTOM_DIVIDER_DELAY_MS = 100;
const TYPING_MS_PER_CHAR = 15;

/**
 * 목록의 포스트 카드. 호버하면 구분선이 펼쳐지고 설명이 한 글자씩 타이핑된다.
 * 색·테두리·썸네일 크기 같은 차이는 전부 theme.card에서 온다.
 */
export default function PostCard({ themeKey, post, renderBadge }: PostCardProps) {
  const theme = POST_THEMES[themeKey];
  const { card } = theme;
  const { t } = useTranslation('');
  const [isHovered, setIsHovered] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [contentHeight, setContentHeight] = useState(0);
  const [dividerVisible, setDividerVisible] = useState(false);
  const [bottomDividerVisible, setBottomDividerVisible] = useState(false);
  const description = post.description;
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // 펼쳐질 영역의 실제 높이 계산
  useEffect(() => {
    if (!contentRef.current) return;
    const updateHeight = () => {
      if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [description, isHovered, currentText]);

  // 슬라이드 → 타이핑 → 하단 구분선 순서의 호버 애니메이션
  useEffect(() => {
    const clearAllTimers = () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    };
    clearAllTimers();

    if (isHovered) {
      timersRef.current.push(setTimeout(() => setDividerVisible(true), DIVIDER_DELAY_MS));
      timersRef.current.push(
        setTimeout(() => {
          setShowDescription(true);
          let i = 0;
          const typing = setInterval(() => {
            if (i <= description.length) {
              setCurrentText(description.substring(0, i));
              i++;
            } else {
              clearInterval(typing);
              timersRef.current.push(
                setTimeout(() => setBottomDividerVisible(true), BOTTOM_DIVIDER_DELAY_MS),
              );
            }
          }, TYPING_MS_PER_CHAR);
          timersRef.current.push(typing as unknown as ReturnType<typeof setTimeout>);
        }, SLIDE_MS),
      );
    }
    return clearAllTimers;
  }, [isHovered, description]);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setDividerVisible(false);
    setShowDescription(false);
    setCurrentText('');
    setBottomDividerVisible(false);
  };

  const renderTypedText = () => {
    if (!currentText) return null;
    const lines = currentText.split('\n');
    return (
      <div>
        {lines.map((line, index) => (
          <div key={index} style={{ marginBottom: index < lines.length - 1 ? '0.5rem' : 0 }}>
            {line || ' '}
            {index === lines.length - 1 && (
              <span
                className={`ml-[1px] inline-block h-4 border-r-2 ${card.cursorClass}`}
                style={{ animation: 'typingCursor 0.75s step-end infinite' }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const badge = card.fixedBadge ? (
    <span className="flex h-8 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
      <MdSecurity className="h-7 w-7" />
    </span>
  ) : renderBadge ? (
    renderBadge(post)
  ) : card.defaultBadge === 'docker' ? (
    <span className="flex items-center rounded bg-[#2496ed] px-2 py-1 text-xs text-white">
      <SiDocker className="mr-1" /> Docker
    </span>
  ) : null;

  const divider = (visible: boolean, fast: boolean) => (
    <div className="relative my-2 h-[1px] overflow-hidden">
      <div
        className={`absolute inset-0 mx-auto bg-gradient-to-r from-transparent to-transparent ${card.dividerClass}`}
        style={{
          transform: visible ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'center',
          opacity: visible ? card.dividerOpacity : 0,
          transition: fast
            ? 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 100ms ease-in-out'
            : 'transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 500ms ease-in-out',
          height: '1px',
        }}
      />
    </div>
  );

  return (
    <article
      className={`group relative rounded-lg p-6 ${card.articleClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {card.layerClasses?.map((cls) => (
        <div key={cls} className={`absolute inset-0 z-0 rounded-lg ${cls}`} />
      ))}

      <div className="relative z-10">
        <div className="mb-1 flex items-center justify-between">
          <h2 className={`text-lg font-medium transition-colors ${card.titleClass}`}>
            {post.title}
          </h2>
          <div className="flex items-center gap-3">
            {post.author && (
              <span className={`text-xs ${card.metaClass}`}>
                {t('post.by', { author: post.author })}
              </span>
            )}
            {badge}
          </div>
        </div>

        {post.topic && (
          <p className={`-mt-1 text-xs ${card.topicClass ?? card.metaClass}`}>{post.topic}</p>
        )}

        {divider(dividerVisible, false)}

        <div
          className="relative mb-2 mt-2 overflow-hidden"
          style={{
            height: isHovered ? `${contentHeight}px` : '0px',
            opacity: isHovered ? 1 : 0,
            transition: `height ${SLIDE_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${SLIDE_MS * 0.8}ms ease-in-out`,
            transformOrigin: 'top',
          }}
        >
          <div
            ref={contentRef}
            className="w-full"
            style={{
              transform: isHovered ? 'translateY(0)' : 'translateY(-20px)',
              opacity: isHovered ? 1 : 0,
              transition: `transform ${SLIDE_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${SLIDE_MS}ms ease-in-out`,
            }}
          >
            {(isHovered || showDescription) && (
              <div className={`mb-4 w-full text-sm ${card.descriptionClass}`}>
                <div className="flex items-start gap-4">
                  <div
                    className={`relative flex-shrink-0 overflow-hidden rounded-md ${card.thumbnailClass}`}
                  >
                    {/* 외부 S3 URL이라 next/image 도메인 설정 전까지 img 유지 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.thumbnail || theme.fallbackImage}
                      alt="thumbnail"
                      className={`h-full w-full transition-transform duration-500 group-hover:scale-110 ${card.imageFitClass}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = theme.fallbackImage;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className={`leading-snug ${card.descriptionIndentClass ?? ''}`}>
                      {renderTypedText()}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {divider(bottomDividerVisible, true)}
          </div>
        </div>

        <div className={`flex items-center justify-between text-xs ${card.footerClass}`}>
          <div className="flex items-center gap-4">
            {card.statIconColorClass ? (
              <>
                <span className="flex items-center gap-1">
                  <AiOutlineEye className={`h-4 w-4 ${card.statIconColorClass}`} />
                  {t('post.views', { count: post.viewCount })}
                </span>
                <span className="flex items-center gap-1">
                  <AiOutlineLike className={`h-4 w-4 ${card.statIconColorClass}`} />
                  {t('post.likes', { count: post.likeCount })}
                </span>
              </>
            ) : (
              <>
                <span>{t('post.views', { count: post.viewCount })}</span>
                <span>{t('post.likes', { count: post.likeCount })}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {post.tags?.map((tag) => (
              <span key={tag} className={`rounded-full px-2 py-1 text-xs ${card.tagClass}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
