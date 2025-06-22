import { Suspense } from 'react';
import { HeroSection } from './components/HeroSection';
import { TechStackSection } from './components/TechStackSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { CertificationsSection } from './components/CertificationSection';

export const metadata = {
  title: 'About Van - Backend Developer Portfolio',
  description: '백엔드 개발자 Van의 포트폴리오입니다. 기술 스택, 경험, 프로젝트를 소개합니다.',
};

export default function AboutVanPage() {
  return (
    <div className="min-h-screen bg-black transition-colors duration-300 relative">
      {/* Left Side Background */}
      <div className="fixed left-0 top-0 w-1/6 h-full bg-gradient-to-r from-black via-gray-900 to-transparent opacity-80 z-0"></div>
      
      {/* Right Side Background */}
      <div className="fixed right-0 top-0 w-1/6 h-full bg-gradient-to-l from-black via-gray-900 to-transparent opacity-80 z-0"></div>
      
      {/* Main Content */}
      <div className="relative z-10">
        <div className="w-full max-w-6xl mx-auto px-12 py-16 bg-white dark:bg-gray-900 min-h-screen shadow-2xl">
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>}>
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