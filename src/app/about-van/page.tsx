import { Suspense } from 'react';
import { HeroSection } from '@/app/about-van/_components/HeroSection';
import { TechStackSection } from '@/app/about-van/_components/TechStackSection';
import { ExperienceSection } from '@/app/about-van/_components/ExperienceSection';
import { ProjectsSection } from '@/app/about-van/_components/ProjectsSection';
import { SkillsSection } from '@/app/about-van/_components/SkillsSection';
import { CertificationsSection } from '@/app/about-van/_components/CertificationSection';

// 메타데이터를 동적으로 생성하는 함수
export async function generateMetadata() {
  // 기본값으로 한국어 메타데이터 사용
  return {
    title: 'About Van - Backend Developer Portfolio',
    description: '백엔드 개발자 Van의 포트폴리오입니다. 기술 스택, 경험, 프로젝트를 소개합니다.',
  };
}

export default function AboutVanPage() {
  return (
    <div className="relative min-h-screen bg-black transition-colors duration-300">
      {/* Left Side Background */}
      <div className="fixed top-0 left-0 z-0 h-full w-1/6 bg-linear-to-r from-black via-gray-900 to-transparent opacity-80" />

      {/* Right Side Background */}
      <div className="fixed top-0 right-0 z-0 h-full w-1/6 bg-linear-to-l from-black via-gray-900 to-transparent opacity-80" />

      {/* Main Content */}
      <div className="relative z-10">
        <div className="mx-auto min-h-screen w-full max-w-6xl bg-white px-12 py-16 shadow-2xl dark:bg-gray-900">
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white" />
              </div>
            }
          >
            <div id="hero">
              <HeroSection />
            </div>
            <div id="tech">
              <TechStackSection />
            </div>
            <div id="skills">
              <SkillsSection />
            </div>
            <div id="experience">
              <ExperienceSection />
            </div>
            <div id="projects">
              <ProjectsSection />
            </div>
            <div id="certifications">
              <CertificationsSection />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
