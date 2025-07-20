import { ProjectService } from '@/interfaces/project';
import { useState } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import MarkdownModal from '@/components/ui/MarkdownModal';

interface ServicesProps {
  services: ProjectService[];
  selectedService: string | null;
  onServiceSelect: (serviceName: string | null) => void;
  selectedTech?: string | null;
}

export default function Services({ services, selectedService, onServiceSelect, selectedTech }: ServicesProps) {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; filePath: string } | null>(null);

  // 서비스를 역할별로 분류
  const serviceCategories = [
    {
      title: '🖥️ Frontend',
      services: services.filter(service => service.name.includes('Frontend')),
      colorTheme: 'blue'
    },
    {
      title: '🛠️ Backend Services',
      services: services.filter(service => 
        service.name.includes('User Service') || service.name.includes('Post Service')
      ),
      colorTheme: 'green'
    },
    {
      title: '🔧 API Services',
      services: services.filter(service => 
        service.name.includes('OAuth') || 
        service.name.includes('Image') || 
        service.name.includes('AI Chat')
      ),
      colorTheme: 'purple'
    }
  ];

  const getColorClasses = (colorTheme: string, isExpanded: boolean, isHovered: boolean) => {
    const themes = {
      blue: {
        expanded: 'border-blue-400 bg-blue-50 shadow-xl scale-[1.02] ring-2 ring-blue-200 ring-opacity-50',
        hovered: 'border-blue-300 bg-blue-50/20 shadow-md cursor-pointer',
        normal: 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/20 hover:shadow-md cursor-pointer',
        techSelected: 'bg-blue-600 text-white shadow-lg',
        techNormal: 'bg-blue-100 text-blue-800',
        accent: 'bg-blue-500',
        hintText: 'text-blue-600',
        arrowColor: 'text-blue-500',
        linkColor: 'text-blue-600 hover:text-blue-800'
      },
      green: {
        expanded: 'border-green-400 bg-green-50 shadow-xl scale-[1.02] ring-2 ring-green-200 ring-opacity-50',
        hovered: 'border-green-300 bg-green-50/20 shadow-md cursor-pointer',
        normal: 'border-gray-200 hover:border-green-300 hover:bg-green-50/20 hover:shadow-md cursor-pointer',
        techSelected: 'bg-green-600 text-white shadow-lg',
        techNormal: 'bg-green-100 text-green-800',
        accent: 'bg-green-500',
        hintText: 'text-green-600',
        arrowColor: 'text-green-500',
        linkColor: 'text-green-600 hover:text-green-800'
      },
      purple: {
        expanded: 'border-purple-400 bg-purple-50 shadow-xl scale-[1.02] ring-2 ring-purple-200 ring-opacity-50',
        hovered: 'border-purple-300 bg-purple-50/20 shadow-md cursor-pointer',
        normal: 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/20 hover:shadow-md cursor-pointer',
        techSelected: 'bg-purple-600 text-white shadow-lg',
        techNormal: 'bg-purple-100 text-purple-800',
        accent: 'bg-purple-500',
        hintText: 'text-purple-600',
        arrowColor: 'text-purple-500',
        linkColor: 'text-purple-600 hover:text-purple-800'
      }
    };
    
    return themes[colorTheme as keyof typeof themes] || themes.blue;
  };

  // 서비스별 문서 링크 매핑
  const getDocumentLinks = (serviceName: string) => {
    const links: Array<{
      title: string;
      filePath: string;
      description: string;
      isHtml?: boolean;
      category: string;
    }> = [];
    
    if (serviceName.includes('Frontend')) {
      links.push({
        title: 'Frontend README',
        filePath: '/docs/frontend-readme.md',
        description: '프로젝트 개요 및 기능 소개',
        category: '📚 개발 가이드'
      });
      links.push({
        title: 'Frontend API 문서',
        filePath: '/docs/frontend-api.md',
        description: 'Frontend API 엔드포인트 및 사용법',
        category: '🔧 API 문서'
      });
      links.push({
        title: 'OAuth 구현 문서',
        filePath: '/docs/frontend-oauth.md',
        description: 'OAuth 인증 구현 상세 가이드',
        category: '🛡️ 보안'
      });
      links.push({
        title: 'Redux 상태 관리 문서',
        filePath: '/docs/frontend-redux.md',
        description: 'Redux를 사용한 상태 관리 구현 가이드',
        category: '🏗️ 아키텍처'
      });
    }
    
    if (serviceName.includes('User Service')) {
      links.push({
        title: 'User Service 개발 가이드',
        filePath: '/docs/user-service-dev.md',
        description: '개발 환경 설정 및 가이드',
        category: '📚 개발 가이드'
      });
      links.push({
        title: 'User Service API 가이드',
        filePath: '/docs/user-service-api.md',
        description: '아키텍처, 인증 시스템, 설계 원칙',
        category: '🔧 API 문서'
      });
      links.push({
        title: 'Swagger API 문서',
        filePath: '/docs/user-swagger/index.html',
        description: 'REST API 명세 및 테스트 인터페이스',
        isHtml: true,
        category: '🔧 API 문서'
      });
      links.push({
        title: 'User Service OAuth 설계 문서',
        filePath: '/docs/user-service-oauth.md',
        description: 'OAuth 도메인 설계 및 플로우 상세 가이드',
        category: '🏗️ 아키텍처'
      });
      links.push({
        title: 'User Service 엔티티 구조 (ERD)',
        filePath: '/docs/user-service-entity.md',
        description: '데이터베이스 엔티티 구조 및 관계 정의',
        category: '🏗️ 아키텍처'
      });
      links.push({
        title: 'User Service 보안 가이드',
        filePath: '/docs/user-service-security.md',
        description: 'JWT 인증, 권한 관리, API 보안 가이드',
        category: '🛡️ 보안'
      });
      links.push({
        title: 'Kotlin 코드 문서 (Dokka)',
        filePath: '/docs/kotlin-api/index.html',
        description: 'Kotlin 백엔드 클래스, 패키지, 함수 문서',
        isHtml: true,
        category: '📖 코드 문서'
      });
    }
    
    if (serviceName.includes('Post Service')) {
      links.push({
        title: 'Post Service README',
        filePath: '/docs/post-service-readme.md',
        description: '개발 환경 설정, 프로젝트 구조, 의존성 정보',
        category: '📚 개발 가이드'
      });
      links.push({
        title: 'Post Service API 문서',
        filePath: '/docs/post-service-api.md',
        description: '포스트 관리 API 문서',
        category: '🔧 API 문서'
      });
      links.push({
        title: 'Swagger API 문서',
        filePath: '/docs/post-swagger/index.html',
        description: 'REST API 명세 및 테스트 인터페이스',
        isHtml: true,
        category: '🔧 API 문서'
      });
      links.push({
        title: 'NestJS 코드 문서 (TypeDoc)',
        filePath: '/docs/nestjs-api/index.html',
        description: 'NestJS 백엔드 클래스, 모듈, 인터페이스 문서',
        isHtml: true,
        category: '📖 코드 문서'
      });
    }
    
    if (serviceName.includes('OAuth')) {
      links.push({
        title: 'OAuth Service README',
        filePath: '/docs/oauth-service-readme.md',
        description: 'OAuth 중간 서버 개요 및 설정 가이드',
        category: '📚 개발 가이드'
      });
      links.push({
        title: 'OAuth Service API 문서',
        filePath: '/docs/oauth-service-api.md',
        description: 'OAuth 인증 서비스 API 문서',
        category: '🔧 API 문서'
      });
      links.push({
        title: 'OAuth 코드 문서 (TypeDoc)',
        filePath: '/docs/oauth-tsdoc/index.html',
        description: 'OAuth 서비스 클래스, 모듈, 인터페이스 문서',
        isHtml: true,
        category: '📖 코드 문서'
      });
    }
    
    if (serviceName.includes('Image')) {
      links.push({
        title: 'Image Service README',
        filePath: '/docs/image-service-readme.md',
        description: 'AWS S3 이미지 업로드 및 WebP 변환 서비스',
        category: '📚 개발 가이드'
      });
      links.push({
        title: 'Image 코드 문서 (TypeDoc)',
        filePath: '/docs/image-tsdoc/index.html',
        description: 'Image 서비스 클래스, 모듈, 인터페이스 문서',
        isHtml: true,
        category: '📖 코드 문서'
      });
    }
    
    if (serviceName.includes('AI Chat')) {
      links.push({
        title: 'AI Chat Service README',
        filePath: '/docs/ai-chat-service-readme.md',
        description: 'OpenAI API 기반 ChatGPT 챗봇 서비스',
        category: '📚 개발 가이드'
      });
      links.push({
        title: 'AI Chat 코드 문서 (TypeDoc)',
        filePath: '/docs/ai-chat-tsdoc/index.html',
        description: 'AI Chat 서비스 클래스, 모듈, 인터페이스 문서',
        isHtml: true,
        category: '📖 코드 문서'
      });
    }
    
    return links;
  };

  const handleDocumentClick = (title: string, filePath: string, isHtml?: boolean) => {
    if (filePath !== '#') {
      if (isHtml) {
        // HTML 문서는 새 탭에서 열기
        window.open(filePath, '_blank', 'noopener,noreferrer');
      } else {
        // 마크다운 문서는 모달에서 열기
        setSelectedDoc({ title, filePath });
        setModalOpen(true);
      }
    }
  };

  const ServiceCard = ({ service, index, colorTheme }: { service: ProjectService; index: number; colorTheme: string }) => {
    const isExpanded = selectedService === service.name;
    const isHovered = hoveredService === service.name;
    const colors = getColorClasses(colorTheme, isExpanded, isHovered);
    const documentLinks = getDocumentLinks(service.name);
    
    const getCardStyle = () => {
      if (isExpanded) return colors.expanded;
      if (isHovered) return colors.hovered;
      return colors.normal;
    };
    
    return (
      <div
        key={index}
        className={`border-2 rounded-xl p-6 transition-all duration-300 ease-in-out shadow-sm ${getCardStyle()}`}
        onMouseEnter={() => setHoveredService(service.name)}
        onMouseLeave={() => setHoveredService(null)}
        onClick={() => onServiceSelect(selectedService === service.name ? null : service.name)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">{service.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
            <div className="flex flex-wrap gap-1">
              {service.tech.map((tech) => (
                <span
                  key={tech}
                  className={`px-2 py-1 rounded text-xs ${
                    selectedTech === tech
                      ? colors.techSelected
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* hover 시 클릭 힌트 */}
        {isHovered && !isExpanded && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className={`text-xs transition-all duration-200 ${colors.hintText} font-medium`}>
                클릭하여 상세 보기
              </span>
              <MdKeyboardArrowDown className={`w-4 h-4 ${colors.arrowColor} animate-bounce`} />
            </div>
          </div>
        )}

        {/* 확장된 상세 정보 */}
        <div 
          className={`grid transition-all duration-600 ease-out ${
            isExpanded 
              ? 'grid-rows-[1fr] opacity-100 mt-6' 
              : 'grid-rows-[0fr] opacity-0 mt-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className={`pt-6 border-t border-gray-300 transform transition-all duration-400 ease-out delay-150 ${
              isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2 text-gray-900">기술 스택</h5>
                  <div className="flex flex-wrap gap-2">
                    {service.tech.map((tech) => (
                      <span
                        key={tech}
                        className={`px-2 py-1 rounded text-sm ${
                          selectedTech === tech
                            ? colors.techSelected
                            : colors.techNormal
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2 text-gray-900">주요 기능</h5>
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${colors.accent}`}></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 문서 링크 섹션 - 카테고리별로 그룹화 */}
                {documentLinks.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-3 text-gray-900">관련 문서</h5>
                    <div className="space-y-4">
                      {(() => {
                        // 카테고리별로 그룹화
                        const groupedDocs = documentLinks.reduce((acc, doc) => {
                          const category = doc.category || '기타';
                          if (!acc[category]) acc[category] = [];
                          acc[category].push(doc);
                          return acc;
                        }, {} as Record<string, typeof documentLinks>);

                        // 카테고리 순서 정의
                        const categoryOrder = [
                          '📚 개발 가이드',
                          '🔧 API 문서', 
                          '🏗️ 아키텍처',
                          '🛡️ 보안',
                          '📖 코드 문서'
                        ];

                        return categoryOrder
                          .filter(category => groupedDocs[category]?.length > 0)
                          .map(category => (
                            <div key={category} className="space-y-2">
                              <h6 className="text-sm font-medium text-gray-700">{category}</h6>
                              <div className="space-y-2 ml-3">
                                {groupedDocs[category].map((link, linkIndex) => (
                                  <div key={linkIndex} className="flex items-start gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${colors.accent}`}></div>
                                    <div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDocumentClick(link.title, link.filePath, link.isHtml);
                                        }}
                                        className={`text-sm font-medium ${colors.linkColor} hover:underline ${
                                          link.filePath === '#' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                        }`}
                                        disabled={link.filePath === '#'}
                                      >
                                        {link.title}
                                      </button>
                                      <p className="text-xs text-gray-600 mt-1">{link.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ));
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">서비스 구성</h3>
        
        {serviceCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-10">
            <h4 className="text-lg font-medium mb-4 text-gray-800">{category.title}</h4>
            <div className="grid grid-cols-1 gap-6">
              {category.services.map((service, serviceIndex) => (
                <ServiceCard 
                  key={serviceIndex} 
                  service={service} 
                  index={serviceIndex} 
                  colorTheme={category.colorTheme}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 마크다운 모달 */}
      <MarkdownModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedDoc?.title || ''}
        filePath={selectedDoc?.filePath || ''}
      />
    </>
  );
} 