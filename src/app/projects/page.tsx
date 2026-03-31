'use client';

import { useState } from 'react';
import Link from 'next/link';
import { vansDevBlogProject, stockDashboardProject } from '@/constants/projects';
import type { Project } from '@/interfaces/project';

// ---------------------------------------------------------------------------
// 목록 페이지용 요약 데이터 (Project 타입에서 파생)
// ---------------------------------------------------------------------------

type ProjectListItem = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl: string;
  linkUrl: string;
  category: string;
  status: string;
  date: string;
  impact: string;
  features: string[];
};

function toListItem(p: Project): ProjectListItem {
  // 각 서비스의 첫 번째 feature를 모아 요약 feature 목록 생성
  const features = p.services.flatMap(s => s.features.slice(0, 2)).slice(0, 6);
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    tech: p.totalTech.slice(0, 8),
    githubUrl: p.githubUrl,
    linkUrl: p.deployUrl,
    category: p.category,
    status: p.status,
    date: p.date,
    impact: p.impact,
    features,
  };
}

const projects: ProjectListItem[] = [
  toListItem(vansDevBlogProject),
  toListItem(stockDashboardProject),
].sort((a, b) => {
  // YYYY.MM → YYYY-MM 으로 변환 후 문자열 비교 (최신순)
  const da = a.date.replace('.', '-');
  const db = b.date.replace('.', '-');
  return db.localeCompare(da);
});

const categories = ['All', '개인', '팀'];

const statusLabels: Record<string, string> = {
  Completed: '완료',
  Deployed: '배포중',
  InProgress: '진행중',
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered =
    selectedCategory === 'All'
      ? projects
      : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 bg-gray-800 p-8 rounded-lg">
          <h1 className="text-4xl font-bold text-white mb-4">Projects</h1>
          <p className="text-lg text-gray-300">개발 프로젝트들을 소개합니다.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {filtered.map(project => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                {/* Project Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <Link href={`/projects/${project.id}`} className="flex-1 cursor-pointer">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded">{project.category}</span>
                        <span>{project.date}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            project.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : project.status === 'Deployed'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {statusLabels[project.status] ?? project.status}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Links */}
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
                <p className="text-gray-700 leading-relaxed">{project.description}</p>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">주요 기능</h4>
                  <div className="grid md:grid-cols-2 gap-1">
                    {project.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-300">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">성과:</span> {project.impact}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">사용 기술</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map(t => (
                      <span key={t} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {t}
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
