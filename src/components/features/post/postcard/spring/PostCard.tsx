'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { SiSpring } from 'react-icons/si';
import { AiOutlineEye, AiOutlineLike } from 'react-icons/ai';
import { useTranslation } from '@/lib/i18n';
import { BasePost } from '@/components/features/post/postcard/BasePost';
import { PostCardProps } from '@/components/features/post/postcard/PostCardProps';

export default function PostCard<T extends BasePost>({ post, renderBadge }: PostCardProps<T>) {
  const { t } = useTranslation('');
  const [isHovered, setIsHovered] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [dividerVisible, setDividerVisible] = useState(false);
  const [bottomDividerVisible, setBottomDividerVisible] = useState(false);
  const description = post.description;
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const descContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const slideAnimationDuration = 600; // ms
  const dividerAnimationDelay = 200; // ms
  const bottomDividerAnimationDelay = 100; // 타이핑 완료 후 하단 구분선 표시 딜레이

  // 컨텐츠 높이 계산 - 한 번만 실행
  useEffect(() => {
    if (!contentRef.current) return;

    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [description, isHovered, currentText]);

  // 슬라이드 및 타이핑 애니메이션 효과
  useEffect(() => {
    const clearAllTimers = () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    };

    clearAllTimers();

    if (isHovered) {
      const dividerTimer = setTimeout(() => {
        setDividerVisible(true);
      }, dividerAnimationDelay);

      timersRef.current.push(dividerTimer);

      const slideTimer = setTimeout(() => {
        setShowDescription(true);

        let i = 0;
        const typingSpeed = 15; // ms per character

        const typingInterval = setInterval(() => {
          if (i <= description.length) {
            setCurrentText(description.substring(0, i));
            i++;
          } else {
            clearInterval(typingInterval);

            const bottomDividerTimer = setTimeout(() => {
              setBottomDividerVisible(true);
            }, bottomDividerAnimationDelay);

            timersRef.current.push(bottomDividerTimer);
          }
        }, typingSpeed);

        timersRef.current.push(typingInterval as unknown as NodeJS.Timeout);
      }, slideAnimationDuration);

      timersRef.current.push(slideTimer);
    } else {
      setDividerVisible(false);
      setShowDescription(false);
      setCurrentText('');
      setBottomDividerVisible(false);
    }

    return clearAllTimers;
  }, [isHovered, description]);

  const renderTextWithLineBreaks = () => {
    if (!currentText) return null;

    const lines = currentText.split('\n');
    const lastLineIndex = lines.length - 1;

    return (
      <div>
        {lines.map((line, index) => (
          <div key={index} style={{ marginBottom: index < lines.length - 1 ? '0.5rem' : 0 }}>
            {line || ' '}
            {index === lastLineIndex && (
              <span
                className="ml-[1px] inline-block h-4 border-r-2 border-white"
                style={{
                  display: 'inline-block',
                  animation: 'typingCursor 0.75s step-end infinite',
                }}
              ></span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <article
      className="group relative rounded-lg border border-slate-700/40 bg-[#0c1511] p-6 text-white hover:shadow-lg hover:shadow-[#6DB33F]/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 배경 레이어 */}
      <div className="absolute inset-0 z-0 rounded-lg bg-gradient-to-b from-[#101b13] to-[#0a100d]"></div>

      {/* 배경 효과 */}
      <div className="absolute inset-0 z-0 rounded-lg bg-[url('/spring-pattern.png')] bg-repeat opacity-5" />
      <div className="absolute inset-0 z-0 rounded-lg bg-gradient-to-r from-[#6DB33F]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-20" />

      <div className="relative z-10">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-medium text-white transition-colors duration-300 group-hover:text-[#9DE67E]/80">
            {post.title}
          </h2>
          <div className="flex items-center gap-3">
            {post.author && (
              <span className="text-xs text-gray-300">{t('post.by', { author: post.author })}</span>
            )}
            {renderBadge && renderBadge(post)}
          </div>
        </div>

        {post.topic && <p className="-mt-1 text-xs text-[#9DE67E]/60">{post.topic}</p>}

        {/* 가로 구분선 - 중앙에서 확장 */}
        <div className="relative my-2 h-[1px] overflow-hidden">
          <div
            className="absolute inset-0 mx-auto bg-gradient-to-r from-transparent via-[#6DB33F]/30 to-transparent"
            style={{
              transform: dividerVisible ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'center',
              opacity: dividerVisible ? 0.4 : 0,
              transition: `transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 500ms ease-in-out`,
              height: '1px',
            }}
          />
        </div>

        {/* Description container with enhanced slide down effect */}
        <div
          ref={descContainerRef}
          className="relative mb-2 mt-2 overflow-hidden"
          style={{
            height: isHovered ? `${contentHeight}px` : '0px',
            opacity: isHovered ? 1 : 0,
            transition: `height ${slideAnimationDuration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${slideAnimationDuration * 0.8}ms ease-in-out`,
            transformOrigin: 'top',
          }}
        >
          <div
            ref={contentRef}
            className="w-full"
            style={{
              transform: isHovered ? 'translateY(0)' : 'translateY(-20px)',
              opacity: isHovered ? 1 : 0,
              transition: `transform ${slideAnimationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${slideAnimationDuration}ms ease-in-out`,
            }}
          >
            {/* Description with typewriting effect and thumbnail */}
            {(isHovered || showDescription) && (
              <div className="mb-4 w-full text-sm text-gray-200">
                <div className="flex items-start gap-4">
                  {/* 썸네일 이미지 */}
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-700/60">
                    <img
                      src={post.thumbnail || '/spring.webp'}
                      alt="thumbnail"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/spring.webp';
                      }}
                    />
                  </div>

                  {/* 텍스트 내용 */}
                  <div className="flex-1">
                    <div className="mt-2 leading-snug">{renderTextWithLineBreaks()}</div>
                  </div>
                </div>
              </div>
            )}
            {/* 하단 구분선 - 중앙에서 확장 */}
            <div className="relative my-2 h-[1px] overflow-hidden">
              <div
                className="absolute inset-0 mx-auto bg-gradient-to-r from-transparent via-[#6DB33F]/30 to-transparent"
                style={{
                  transform: bottomDividerVisible ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'center',
                  opacity: bottomDividerVisible ? 0.3 : 0,
                  transition: `transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 100ms ease-in-out`,
                  height: '1px',
                  width: '100%',
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-300">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <AiOutlineEye className="h-4 w-4 text-[#6DB33F]/60" />
              {post.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <AiOutlineLike className="h-4 w-4 text-[#6DB33F]/60" />
              {post.likeCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {post.tags &&
              post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-700/40 bg-slate-800/70 px-2 py-1 text-xs text-gray-300"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>
    </article>
  );
}
