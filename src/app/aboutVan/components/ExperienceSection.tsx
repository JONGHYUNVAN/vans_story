'use client';

import { useState } from 'react';
import { useTranslation } from '@/utils/i18n';

const experiencesKo = [
  {
    id: 1,
    company: '소프트웨어 엔지니어링 부트캠프',
    position: '백엔드 개발 과정 수료',
    period: '2022.10 - 2023.04',
    location: '서울, 한국',
    description:
      '6개월 간의 집중 교육을 통해 Java/Spring 기반 웹 애플리케이션 개발 전 과정을 실습하고, 백엔드 설계, 데이터베이스 모델링, 배포까지 실무 수준의 기술을 익혔습니다.',
    achievements: [
      'Spring Boot 기반 RESTful API 설계 및 구현',
      'JPA를 이용한 ORM 매핑 및 관계형 DB 모델링 실습',
      'AWS 및 Docker를 활용한 개발·배포 환경 구성',
      'TDD, 예외 처리, 로깅 등 실무 중심 백엔드 설계 능력 습득'
    ],
    tech: ['Java', 'Spring Boot', 'JPA', 'MySQL', 'Git', 'AWS', 'Docker', 'TDD']
  },
  {
    id: 2,
    company: '건국대학교',
    position: '청년일경험 지원 프로그램 SW개발 과정',
    period: '2024.05 - 2024.09',
    location: '서울, 한국',
    description:
      '고용노동부와 대한상공회의소가 주관하는 미래내일 일경험 프로그램의 SW개발 과정에 참여하여, 팀 프로젝트와 현업 멘토링을 통해 실무 중심의 개발 역량을 강화했습니다.',
    achievements: [
      '2개월간의 직무교육과 3개월 현장실습을 통한 프로젝트 수행',
      '팀 프로젝트 개발 및 결과물 산출',
      'Spring 기반 REST API 설계 및 클라우드 인프라 구성 경험',
      '현업 개발자 멘토링을 통한 기술 역량 및 협업 능력 향상'
    ],
    tech: ['Java', 'Spring Boot', 'JavaScript', 'MySQL', 'Git', 'AWS', 'Docker']
  },
  {
    id: 3,
    company: '아키아카',
    position: 'A팀 팀장, Meta2day 프로젝트 백엔드 구현 담당',
    period: '2024.06 - 2024.09',
    location: '서울, 한국',
    description:
      '공공·민간 아카이빙 솔루션을 개발하는 아키아카에서 A팀 팀장으로 Meta2day 프로젝트의 백엔드 구현을 총괄하며, 팀을 리드하고 실무 중심의 풀스택 개발을 수행했습니다.',
    achievements: [
      'A팀 팀장으로 프로젝트 일정 조율 및 팀원 역할 분담',
      'Spring Boot 기반 백엔드 아키텍처 설계 및 API 구현',
      'MySQL을 활용한 데이터베이스 모델링 및 쿼리 최적화',
      'Next.js 및 NestJS 연동을 통한 풀스택 시스템 개발 완료'
    ],
    tech: ['Java', 'Spring Boot', 'MySQL', 'Git', 'AWS']
  },
  {
    id: 4,
    company: '대아정보시스템',
    position: 'EMR 시스템 유지보수 및 서식 관리 담당',
    period: '2024.11 - 현재',
    location: '수원, 한국',
    description:
      '아주대학교병원 내 의료정보시스템 전문 기업인 대아정보시스템에서, C# 기반 EMR 시스템의 유지보수와 진료 관련 서식(Form) 생성 및 개정 업무를 담당하고 있습니다.',
    achievements: [
      'C# 기반 전자의무기록(EMR) 시스템 유지보수 및 기능 개선',
      '진료, 간호, 수술 등 의료 현장 요구에 따른 서식 신규 생성 및 개정',
      '병원 내 정보관리팀 및 사용자와의 협업을 통한 요구사항 분석',
      '오류 수정, UI 개선, 버전 배포 등 안정적인 시스템 운영 지원'
    ],
    tech: ['C#', '.NET Framework', 'WinForms', 'Oracle']
  }
];

const experiencesEn = [
  {
    id: 1,
    company: 'Software Engineering Bootcamp',
    position: 'Backend Development Course Completion',
    period: '2022.10 - 2023.04',
    location: 'Seoul, South Korea',
    description:
      'Through 6 months of intensive education, I practiced the entire process of Java/Spring-based web application development and learned practical-level skills from backend design, database modeling to deployment.',
    achievements: [
      'Spring Boot-based RESTful API design and implementation',
      'ORM mapping using JPA and relational DB modeling practice',
      'Development and deployment environment configuration using AWS and Docker',
      'Acquired practical-oriented backend design skills including TDD, exception handling, and logging'
    ],
    tech: ['Java', 'Spring Boot', 'JPA', 'MySQL', 'Git', 'AWS', 'Docker', 'TDD']
  },
  {
    id: 2,
    company: 'Konkuk University',
    position: 'Youth Work Experience Program SW Development Course',
    period: '2024.05 - 2024.09',
    location: 'Seoul, South Korea',
    description:
      'Participated in the SW development course of the Future Tomorrow Work Experience Program hosted by the Ministry of Employment and Labor and the Korea Chamber of Commerce and Industry, strengthening practical development capabilities through team projects and industry mentoring.',
    achievements: [
      'Project execution through 2 months of job training and 3 months of field practice',
      'Team project development and deliverable production',
      'Experience in Spring-based REST API design and cloud infrastructure configuration',
      'Enhanced technical capabilities and collaboration skills through industry developer mentoring'
    ],
    tech: ['Java', 'Spring Boot', 'JavaScript', 'MySQL', 'Git', 'AWS', 'Docker']
  },
  {
    id: 3,
    company: 'AKIAKA',
    position: 'Team A Leader, Meta2day Project Backend Implementation',
    period: '2024.06 - 2024.09',
    location: 'Seoul, South Korea',
    description:
      'At AKIAKA, which develops public and private archiving solutions, I served as Team A leader overseeing the backend implementation of the Meta2day project, leading the team and performing practical full-stack development.',
    achievements: [
      'Project schedule coordination and team member role assignment as Team A leader',
      'Spring Boot-based backend architecture design and API implementation',
      'Database modeling and query optimization using MySQL',
      'Full-stack system development completion through Next.js and NestJS integration'
    ],
    tech: ['Java', 'Spring Boot', 'MySQL', 'Git', 'AWS']
  },
  {
    id: 4,
    company: 'DAEA Information System',
    position: 'EMR System Maintenance and Form Management',
    period: '2024.11 - Present',
    location: 'Suwon, South Korea',
    description:
      'At DAEA Information System, a medical information system specialist company within Ajou University Hospital, I am responsible for maintaining C#-based EMR systems and creating and revising medical forms.',
    achievements: [
      'C#-based Electronic Medical Record (EMR) system maintenance and functional improvement',
      'New form creation and revision according to medical field requirements for treatment, nursing, surgery, etc.',
      'Requirements analysis through collaboration with hospital information management team and users',
      'Stable system operation support including error correction, UI improvement, and version deployment'
    ],
    tech: ['C#', '.NET Framework', 'WinForms', 'Oracle']
  }
];

export function ExperienceSection() {
  const { t, locale } = useTranslation('about');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 언어에 따라 데이터 선택
  const experiences = locale === 'ko' ? experiencesKo : experiencesEn;

  return (
    <section className="py-20 border-b border-gray-200 dark:border-gray-800">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {t('AboutVan.experience.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {t('AboutVan.experience.description')}
          </p>
        </div>

        {/* Experience Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800">
          {experiences.map((exp, index) => (
            <button
              key={exp.id}
              onClick={() => setSelectedIndex(index)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                selectedIndex === index
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {exp.company}
            </button>
          ))}
        </div>

        {/* Experience Detail */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {experiences[selectedIndex].position}
            </h3>
            <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
              <span className="font-medium">{experiences[selectedIndex].company}</span>
              <span>•</span>
              <span>{experiences[selectedIndex].period}</span>
              <span>•</span>
              <span>{experiences[selectedIndex].location}</span>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {experiences[selectedIndex].description}
          </p>

          {/* Achievements */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('AboutVan.experience.achievements')}
            </h4>
            <ul className="space-y-2">
              {experiences[selectedIndex].achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1.5 text-sm">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('AboutVan.experience.techUsed')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {experiences[selectedIndex].tech.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 