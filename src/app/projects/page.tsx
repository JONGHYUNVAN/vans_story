'use client';

import { useState } from 'react';
import Link from 'next/link';

// VansDevBlog 프로젝트 데이터
const vansDevBlogProject = {
  id: 1,
  title: 'Van\'s DevBlog',
  description: '현재 배포 중인 개인 기술 블로그입니다. 마이크로서비스 아키텍처를 적용하여 6개의 독립적인 서비스로 구성되어 있습니다.',
  tech: ['Spring Boot', 'Kotlin', 'Next.js', 'NestJS', 'TypeScript', 'MariaDB', 'MongoDB', 'Tailwind CSS'],
  githubUrl: 'https://github.com/JONGHYUNVAN/vans_story',
  linkUrl: 'https://vansdevblog.online/',
  category: '개인',
  status: 'Deployed',
  date: '2024.12',
  impact: '마이크로서비스 아키텍처 설계 및 구현, 독립적인 서비스 배포, 확장성 있는 시스템 구축',
  features: [
    'JWT 기반 사용자 인증 시스템',
    'Tiptap 에디터를 활용한 포스트 작성',
    'AI 채팅 모달 기능',
    '이미지 업로드 및 최적화',
    '다국어 지원 (한국어/영어)',
    'JavaDoc,TsDoc,Storybook을 활용한 문서화'
  ]
};

// 추가 프로젝트들 (나중에 추가할 예정)
const projects = [vansDevBlogProject];

const categories = ['All', '개인', '팀'];

const statusLabels = {
  'Completed': '완료',
  'Deployed': '배포중',
  'InProgress': '진행중'
};

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 bg-gray-800 p-8 rounded-lg">
          <h1 className="text-4xl font-bold text-white mb-4">
            Projects
          </h1>
          <p className="text-lg text-gray-300">
            개발 프로젝트들을 소개합니다.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-lg transition-all relative"
            >
              <div className="space-y-4">
                {/* Project Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <Link
                    href={`/projects/${project.id === 1 ? 'vansdevblog' : project.id}`}
                    className="flex-1 cursor-pointer"
                  >
                  <div className="space-y-1">
                      <h3 className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {project.category}
                      </span>
                      <span>{project.date}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        project.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : project.status === 'Deployed'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {statusLabels[project.status as keyof typeof statusLabels] || project.status}
                      </span>
                    </div>
                  </div>
                  </Link>
                  
                  {/* Project Links */}
                  <div className="flex gap-2 flex-shrink-0">
                    {project.githubUrl && (
                      <button
                        onClick={() => window.open(project.githubUrl, '_blank', 'noopener,noreferrer')}
                        className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:border-gray-400 transition-colors"
                      >
                        GitHub
                      </button>
                    )}
                    {project.linkUrl && (
                      <button
                        onClick={() => window.open(project.linkUrl, '_blank', 'noopener,noreferrer')}
                        className="px-3 py-1 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                      >
                        사이트 방문
                      </button>
                    )}
                    
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed">
                  {project.description}
                </p>

                {/* Features */}
                {project.features && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      주요 기능
                    </h4>
                    <div className="grid md:grid-cols-2 gap-1">
                      {project.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Impact */}
                <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-300">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">성과:</span> {project.impact}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    사용 기술
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 