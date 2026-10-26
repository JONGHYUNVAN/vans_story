'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import type { TechCategoryKey, TechStackItem, Tone } from '@/app/about-van/_types/portfolio';

// 카드 배경·테두리·hover 색은 JSON의 tone 토큰으로만 고르고, 실제 클래스는 여기서 결정한다.
const TONE_CLASSES: Record<Tone, string> = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40',
  red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40',
  green:
    'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40',
  purple:
    'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40',
};

// 글자당 타이핑 간격(ms)과 두 설명 사이의 간격(ms)
const TYPING_INTERVAL_MS = 15;
const SECTION_DELAY_MS = 200;

export default function TechStackSection() {
  const { t, locale } = useTranslation('about');
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [typewriterCommonText, setTypewriterCommonText] = useState<string>('');
  const [typewriterMyText, setTypewriterMyText] = useState<string>('');
  const [isTypingCommon, setIsTypingCommon] = useState<boolean>(false);
  const [isTypingMy, setIsTypingMy] = useState<boolean>(false);

  const techStack: TechStackItem[] = t('AboutVan.techStack.items');
  const categoryLabels: Record<TechCategoryKey, string> = t('AboutVan.techStack.categories');
  const categories = Object.keys(categoryLabels) as TechCategoryKey[];

  // 호버 대상(또는 언어)이 바뀌면 렌더 중에 타이핑 상태를 초기화 (effect 내 동기 setState 방지)
  const typingKey = hoveredTech ? `${locale}:${hoveredTech}` : null;
  const [prevTypingKey, setPrevTypingKey] = useState<string | null>(null);
  if (prevTypingKey !== typingKey) {
    setPrevTypingKey(typingKey);
    setTypewriterCommonText('');
    setTypewriterMyText('');
    setIsTypingCommon(hoveredTech !== null);
    setIsTypingMy(false);
  }

  // Typewriter effect for tech descriptions
  useEffect(() => {
    if (!hoveredTech) return;

    const currentTech = techStack.find((tech) => tech.name === hoveredTech);
    if (!currentTech) return;

    let commonIndex = 0;
    const commonText = currentTech.commonReason;

    const commonInterval = setInterval(() => {
      if (commonIndex < commonText.length) {
        setTypewriterCommonText(commonText.substring(0, commonIndex + 1));
        commonIndex++;
      } else {
        setIsTypingCommon(false);
        clearInterval(commonInterval);

        // Start typing my reason after common reason is done
        setTimeout(() => {
          setIsTypingMy(true);
          setTypewriterMyText('');

          let myIndex = 0;
          const myText = currentTech.myReason;

          const myInterval = setInterval(() => {
            if (myIndex < myText.length) {
              setTypewriterMyText(myText.substring(0, myIndex + 1));
              myIndex++;
            } else {
              setIsTypingMy(false);
              clearInterval(myInterval);
            }
          }, TYPING_INTERVAL_MS);
        }, SECTION_DELAY_MS);
      }
    }, TYPING_INTERVAL_MS);

    return () => clearInterval(commonInterval);
  }, [hoveredTech, techStack]);

  return (
    <section className="border-b border-gray-200 py-20 dark:border-gray-800">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 md:text-5xl dark:text-white">
            {t('AboutVan.techStack.title')}
          </h2>
          <p className="max-w-2xl text-lg whitespace-pre-line text-gray-600 dark:text-gray-400">
            {t('AboutVan.techStack.description')}
          </p>
        </div>

        {/* Tech Stack by Categories */}
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryTechs = techStack.filter((tech) => tech.category === category);
            if (categoryTechs.length === 0) return null;

            return (
              <div key={category} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {categoryLabels[category]}
                  </h3>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Tech List for Category */}
                <div className="grid items-start gap-6 md:grid-cols-2">
                  {categoryTechs.map((tech) => (
                    <div
                      key={tech.name}
                      className={`group rounded-lg border-2 p-2 pt-4 pb-1 transition-all duration-500 ease-in-out ${TONE_CLASSES[tech.tone]}`}
                      onMouseEnter={() => setHoveredTech(tech.name)}
                      onMouseLeave={() => setHoveredTech(null)}
                    >
                      {/* Tech Header */}
                      <div className="mb-4 flex items-center gap-3">
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 object-contain"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            {tech.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {categoryLabels[tech.category]}
                          </p>
                        </div>
                      </div>

                      {/* Expandable Content */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          hoveredTech === tech.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="mt-4 space-y-3 pb-3">
                          <div className="rounded-sm bg-white/50 p-3 dark:bg-gray-800/50">
                            <h5 className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                              {t('AboutVan.techStack.commonAdvantages')}
                            </h5>
                            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                              {hoveredTech === tech.name ? (
                                <>
                                  {typewriterCommonText}
                                  {isTypingCommon && (
                                    <span className="ml-1 animate-pulse text-green-600 dark:text-green-400">
                                      |
                                    </span>
                                  )}
                                </>
                              ) : (
                                tech.commonReason
                              )}
                            </p>
                          </div>

                          <div className="rounded-sm bg-blue-50/50 p-3 dark:bg-blue-900/20">
                            <h5 className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                              {t('AboutVan.techStack.myChoice')}
                            </h5>
                            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                              {hoveredTech === tech.name ? (
                                <>
                                  {typewriterMyText}
                                  {isTypingMy && (
                                    <span className="ml-1 animate-pulse text-blue-600 dark:text-blue-400">
                                      |
                                    </span>
                                  )}
                                </>
                              ) : (
                                tech.myReason
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
