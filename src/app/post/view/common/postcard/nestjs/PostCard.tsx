import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/utils/i18n';
import { BasePost } from '../BasePost';
import { PostCardProps } from '../PostCardProps';

export default function PostCard<T extends BasePost>({ 
  post, 
  renderBadge 
}: PostCardProps<T>) {
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
    
    // 콘텐츠가 실제 렌더링된 후에 높이 계산
    const updateHeight = () => {
      if (contentRef.current) {
        // 실제 콘텐츠 높이 + 약간의 여백
        setContentHeight(contentRef.current.scrollHeight);
      }
    };
    
    // 컴포넌트 마운트 후 또는 텍스트 변경 후 실행
    updateHeight();
    
    // 윈도우 리사이즈 시에도 높이 재계산
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [description, isHovered, currentText]);
  
  // 슬라이드 및 타이핑 애니메이션 효과
  useEffect(() => {
    // 모든 타이머 정리
    const clearAllTimers = () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current = [];
    };
    
    clearAllTimers();

    if (isHovered) {
      // 구분선 표시 타이머
      const dividerTimer = setTimeout(() => {
        setDividerVisible(true);
      }, dividerAnimationDelay);
      
      timersRef.current.push(dividerTimer);
      
      // 슬라이드 애니메이션 종료 후 타이핑 시작
      const slideTimer = setTimeout(() => {
        setShowDescription(true);
        
        // 한 글자씩 타이핑 효과
        let i = 0;
        const typingSpeed = 15; // ms per character
        
        const typingInterval = setInterval(() => {
          if (i <= description.length) {
            setCurrentText(description.substring(0, i));
            i++;
          } else {
            clearInterval(typingInterval);
            // 커서는 제거하지 않고 유지
            
            // 타이핑이 완료되면 하단 구분선 표시
            const bottomDividerTimer = setTimeout(() => {
              setBottomDividerVisible(true);
            }, bottomDividerAnimationDelay);
            
            timersRef.current.push(bottomDividerTimer);
          }
        }, typingSpeed);
        
        timersRef.current.push(typingInterval as unknown as NodeJS.Timeout);
      }, slideAnimationDuration); // 슬라이드 애니메이션 지속 시간
      
      timersRef.current.push(slideTimer);
    } else {
      // 호버 해제 시 초기화
      setDividerVisible(false);
      setShowDescription(false);
      setCurrentText('');
      setBottomDividerVisible(false);
    }

    // 컴포넌트 언마운트 시 모든 타이머 정리
    return clearAllTimers;
  }, [isHovered, description]);

  // 텍스트를 줄바꿈 포함하여 렌더링하되 줄 간격을 일정하게 유지
  const renderTextWithLineBreaks = () => {
    if (!currentText) return null;
    
    const lines = currentText.split('\n');
    const lastLineIndex = lines.length - 1;
    
    return (
      <div>
        {lines.map((line, index) => (
          <div key={index} style={{ marginBottom: index < lines.length - 1 ? '0.5rem' : 0 }}>
            {line || ' '}
            {/* 커서는 마지막 줄에만 표시하고, 타이핑이 끝나도 계속 표시 */}
            {index === lastLineIndex && (
              <span
                className="inline-block border-r-2 border-white h-4 ml-[1px]"
                style={{ 
                  display: 'inline-block', // 항상 표시
                  animation: 'typingCursor 0.75s step-end infinite'
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
      className="group relative rounded-lg bg-black text-white hover:shadow-lg hover:shadow-red-400/20 p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-medium text-white group-hover:text-white transition-colors">
          {post.title}
        </h2>
        <div className="flex items-center gap-3">
          {post.author && (
            <span className="text-xs text-gray-400">{t('post.by', { author: post.author })}</span>
          )}
          {renderBadge && renderBadge(post)}
        </div>
      </div>
      
      {post.topic && (
        <p className="text-xs text-gray-400 -mt-1">{post.topic}</p>
      )}
      
      {/* 가로 구분선 - 중앙에서 확장 */}
      <div className="relative h-[1px] my-2 overflow-hidden">
        <div 
          className="absolute inset-0 mx-auto bg-gradient-to-r from-transparent via-[#E0234E] to-transparent"
          style={{
            transform: dividerVisible ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'center',
            opacity: dividerVisible ? 0.6 : 0,
            transition: `transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 500ms ease-in-out`,
            height: '1px'
          }}
        />
      </div>
      
      {/* Description container with enhanced slide down effect */}
      <div 
        ref={descContainerRef}
        className="relative overflow-hidden mt-2 mb-2"
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
            transition: `transform ${slideAnimationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${slideAnimationDuration}ms ease-in-out`
          }}
        >
          {/* Description with typewriting effect and thumbnail */}
          {(isHovered || showDescription) && (
            <div className="text-gray-300 text-sm mb-4 w-full">
              <div className="flex items-start gap-4">
                {/* 썸네일 이미지 */}
                <div className="relative w-24 h-28 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={post.thumbnail || '/nestjs.webp'}
                    alt="thumbnail"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 이미지로 대체
                      (e.target as HTMLImageElement).src = '/nest.webp';
                    }}
                  />
                </div>
                
                {/* 텍스트 내용 */}
                <div className="flex-1">
                  <div className="leading-snug mt-2">
                    {renderTextWithLineBreaks()}
                  </div>
                </div>
              </div>
            </div>
          )}
           {/* 하단 구분선 - 중앙에서 확장 */}
           <div className="relative h-[1px] my-2 overflow-hidden">
                    <div 
                      className="absolute inset-0 mx-auto bg-gradient-to-r from-transparent via-[#E0234E] to-transparent"
                      style={{
                        transform: bottomDividerVisible ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'center',
                        opacity: bottomDividerVisible ? 0.6 : 0,
                        transition: `transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 100ms ease-in-out`,
                        height: '1px',
                        width: '100%'
                      }}
                    />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>{t('post.views', { count: post.viewCount })}</span>
          <span>{t('post.likes', { count: post.likeCount })}</span>
        </div>
        <div className="flex items-center gap-2">
          {post.tags.map(tag => (
            <span 
              key={tag}
              className="px-2 py-1 bg-zinc-800 text-gray-300 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
} 