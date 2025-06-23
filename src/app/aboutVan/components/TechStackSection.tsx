'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/utils/i18n';

const techStackKo = [
  {
    name: 'Next.js',
    category: 'Frontend',
    icon: '/nextjs.webp',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/40',
    commonReason: 'React 기반의 풀스택 프레임워크로, SSR/SSG를 통한 SEO 최적화와 성능 향상을 위해 널리 사용됩니다.',
    myReason: '이미지 및 AI 라우팅 기능을 API Routes 기반으로 분리하여 추가 유료 서버 구성 없이도 마이크로서비스 형태로 운영할 수 있으며, WebP 자동 변환 및 Webpack 설정 자동화 등 정적 리소스 최적화 기능이 내장되어 있어 선택했습니다.'
  },
  {
    name: 'NestJS',
    category: 'Backend',
    icon: '/nestjs.webp',
    color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    hoverColor: 'hover:bg-red-100 dark:hover:bg-red-900/40',
    commonReason: 'TypeScript 기반의 Node.js 프레임워크로, 데코레이터와 의존성 주입을 통한 확장 가능한 서버 사이드 애플리케이션 구축에 사용됩니다.',
    myReason: '프론트엔드에서 사용하는 Next.js와 동일한 TypeScript 기반으로 타입을 공유할 수 있고, 백엔드 구조는 Spring과 유사하여 익숙한 아키텍처 패턴으로 안정적인 서버 개발이 가능해 선택했습니다.'
  },
  {
    name: 'Spring',
    category: 'Backend',
    icon: '/spring.webp',
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/40',
    commonReason: 'Java 기반의 프레임워크로, DI, AOP, 트랜잭션 관리 등 엔터프라이즈 기능을 제공하여 복잡한 비즈니스 로직 처리에 강력한 구조적 안정성과 생산성을 보장합니다.',
    myReason: '가장 널리 사용되는 백엔드 프레임워크로 안정성과 검증된 아키텍처를 갖추고 있으며, Kotlin과 함께 사용할 경우 NestJS와 유사한 구조와 개발 패턴을 공유할 수 있어 선택했습니다.'
  },
  {
    name: 'MariaDB',
    category: 'Database',
    icon: '/mariadb.webp',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/40',
    commonReason: 'MySQL과 호환되면서 오픈소스인 관계형 데이터베이스로, 높은 성능과 안정성으로 웹 애플리케이션에서 널리 사용됩니다.',
    myReason: 'MySQL과 매우 유사하고, MySQL 무료버전에선 사용할 수 없는 기능들들 사용할할 수 있어 선택했습니다다.'
  },
  {
    name: 'MongoDB',
    category: 'Database',
    icon: '/mongodb.webp',
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/40',
    commonReason: 'NoSQL 도큐먼트 데이터베이스로, 스키마가 유연하고 JSON과 유사한 구조로 빠른 개발과 확장성을 위해 사용됩니다.',
    myReason: 'Tiptap → Next.js → NestJS를 거쳐 구조화된 데이터를 저장하는 과정에서, 스키마 유연성과 JSON 기반 문서 저장 구조가 잘 맞아 MongoDB를 선택했습니다.'
  }
];

const techStackEn = [
  {
    name: 'Next.js',
    category: 'Frontend',
    icon: '/nextjs.webp',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/40',
    commonReason: 'A React-based full-stack framework widely used for SEO optimization and performance improvement through SSR/SSG.',
    myReason: 'I chose it because I can separate image and AI routing functions based on API Routes to operate in a microservice form without additional paid server configuration, and it has built-in static resource optimization features like WebP automatic conversion and Webpack configuration automation.'
  },
  {
    name: 'NestJS',
    category: 'Backend',
    icon: '/nestjs.webp',
    color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    hoverColor: 'hover:bg-red-100 dark:hover:bg-red-900/40',
    commonReason: 'A TypeScript-based Node.js framework used for building scalable server-side applications through decorators and dependency injection.',
    myReason: 'I chose it because it can share types with Next.js used in the frontend based on the same TypeScript, and the backend structure is similar to Spring, allowing stable server development with familiar architecture patterns.'
  },
  {
    name: 'Spring',
    category: 'Backend',
    icon: '/spring.webp',
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/40',
    commonReason: 'A Java-based framework that provides enterprise features such as DI, AOP, and transaction management, ensuring strong structural stability and productivity for handling complex business logic.',
    myReason: 'I chose it as the most widely used backend framework with stability and proven architecture. When used with Kotlin, it can share similar structures and development patterns with NestJS.'
  },
  {
    name: 'MariaDB',
    category: 'Database',
    icon: '/mariadb.webp',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/40',
    commonReason: 'A MySQL-compatible open-source relational database widely used in web applications for high performance and stability.',
    myReason: 'I chose it because it\'s very similar to MySQL and allows me to use features that are not available in the free version of MySQL.'
  },
  {
    name: 'MongoDB',
    category: 'Database',
    icon: '/mongodb.webp',
    color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/40',
    commonReason: 'A NoSQL document database used for rapid development and scalability with flexible schema and JSON-like structure.',
    myReason: 'I chose MongoDB because in the process of storing structured data through Tiptap → Next.js → NestJS, the schema flexibility and JSON-based document storage structure fit well.'
  }
];

const categories = ['Frontend', 'Backend', 'Database'];

export function TechStackSection() {
  const { t, locale } = useTranslation('about');
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [typewriterCommonText, setTypewriterCommonText] = useState<string>('');
  const [typewriterMyText, setTypewriterMyText] = useState<string>('');
  const [isTypingCommon, setIsTypingCommon] = useState<boolean>(false);
  const [isTypingMy, setIsTypingMy] = useState<boolean>(false);

  // 언어에 따라 데이터 선택
  const techStack = locale === 'ko' ? techStackKo : techStackEn;

  // Typewriter effect for tech descriptions
  useEffect(() => {
    if (!hoveredTech) {
      setTypewriterCommonText('');
      setTypewriterMyText('');
      setIsTypingCommon(false);
      setIsTypingMy(false);
      return;
    }

    const currentTech = techStack.find(tech => tech.name === hoveredTech);
    if (!currentTech) return;

    // Start typing common reason first
    setIsTypingCommon(true);
    setTypewriterCommonText('');
    
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
          }, 15); // 15ms per character for faster typing
        }, 200); // 200ms delay between sections
      }
    }, 15); // 15ms per character for faster typing

    return () => clearInterval(commonInterval);
  }, [hoveredTech, techStack]);

  const getTechsByCategory = (category: string) => {
    return techStack.filter(tech => tech.category === category);
  };

  return (
    <section className="py-20 border-b border-gray-200 dark:border-gray-800">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {t('AboutVan.techStack.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl whitespace-pre-line">
            {t('AboutVan.techStack.description')}
          </p>
        </div>

        {/* Tech Stack by Categories */}
        <div className="space-y-12">
          {categories.map((category) => {
            const categoryTechs = getTechsByCategory(category);
            if (categoryTechs.length === 0) return null;
            
            return (
              <div key={category} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {category}
                  </h3>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Tech List for Category */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {categoryTechs.map((tech) => (
                    <div
                      key={tech.name}
                      className={`group pt-4 pb-1 p-2 border-2 rounded-lg transition-all duration-500 ease-in-out ${tech.color} ${tech.hoverColor}`}
                      onMouseEnter={() => setHoveredTech(tech.name)}
                      onMouseLeave={() => setHoveredTech(null)}
                    >
                      {/* Tech Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={tech.icon} 
                          alt={tech.name}
                          className="w-8 h-8 object-contain"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            {tech.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tech.category}
                          </p>
                        </div>
                      </div>

                      {/* Expandable Content */}
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        hoveredTech === tech.name 
                          ? 'max-h-96 opacity-100' 
                          : 'max-h-0 opacity-0'
                      }`}>
                        <div className="space-y-3 mt-4 pb-3">
                          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-1 text-sm">
                              {t('AboutVan.techStack.commonAdvantages')}
                            </h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {hoveredTech === tech.name ? (
                                <>
                                  {typewriterCommonText}
                                  {isTypingCommon && (
                                    <span className="animate-pulse text-green-600 dark:text-green-400 ml-1">|</span>
                                  )}
                                </>
                              ) : (
                                tech.commonReason
                              )}
                            </p>
                          </div>
                          
                          <div className="p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-1 text-sm">
                              {t('AboutVan.techStack.myChoice')}
                            </h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {hoveredTech === tech.name ? (
                                <>
                                  {typewriterMyText}
                                  {isTypingMy && (
                                    <span className="animate-pulse text-blue-600 dark:text-blue-400 ml-1">|</span>
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