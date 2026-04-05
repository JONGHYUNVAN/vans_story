'use client';

import { useState } from 'react';
import Link from 'next/link';
import { vansDevBlogProject, stockDashboardProject } from '@/constants/projects';
import type { Project } from '@/interfaces/project';

// ---------------------------------------------------------------------------
// 목록 아이템 타입
// ---------------------------------------------------------------------------
type ProjectListItem = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  techCount: number;
  serviceCount: number;
  githubUrl: string;
  linkUrl: string;
  category: string;
  status: string;
  date: string;
  impact: string;
  features: string[];
};

function toListItem(p: Project): ProjectListItem {
  const features = p.services.flatMap(s => s.features.slice(0, 2)).slice(0, 6);
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    tech: p.totalTech.slice(0, 8),
    techCount: p.totalTech.length,
    serviceCount: p.services.length,
    githubUrl: p.githubUrl,
    linkUrl: p.deployUrl,
    category: p.category,
    status: p.status,
    date: p.date,
    impact: p.impact,
    features,
  };
}

const allRaw = [vansDevBlogProject, stockDashboardProject];

const projects: ProjectListItem[] = allRaw.map(toListItem);


const categories = ['All', '개인', '팀'];

const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
  Deployed:   { label: '배포중',  dot: 'bg-emerald-400', text: 'text-emerald-400' },
  Completed:  { label: '완료',    dot: 'bg-sky-400',     text: 'text-sky-400'     },
  InProgress: { label: '진행중',  dot: 'bg-amber-400',   text: 'text-amber-400'   },
};

// ---------------------------------------------------------------------------
// 서브 컴포넌트 — 카드 공통 외부링크 버튼
// ---------------------------------------------------------------------------
function ExternalLinks({ githubUrl, linkUrl }: { githubUrl: string; linkUrl: string }) {
  return (
    <div className="relative z-20 pointer-events-auto flex gap-2 flex-shrink-0">
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="px-3 py-1.5 text-xs font-medium border border-white/10 rounded-md
                     text-zinc-400 hover:text-white hover:border-white/30 transition-all"
        >
          GitHub
        </a>
      )}
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="px-3 py-1.5 text-xs font-medium rounded-md
                     bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          사이트 방문 ↗
        </a>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Featured 카드 (첫 번째 프로젝트)
// ---------------------------------------------------------------------------
function FeaturedCard({ p }: { p: ProjectListItem }) {
  const st = statusConfig[p.status] ?? statusConfig.Completed;
  return (
    /* 그라디언트 테두리 래퍼 */
    <div className="relative rounded-2xl p-px bg-gradient-to-br from-indigo-500/60 via-purple-500/30 to-indigo-500/10
                    group cursor-pointer
                    hover:from-indigo-400/80 hover:via-purple-400/50 hover:to-indigo-400/20
                    transition-all duration-300">
      {/* 전체 클릭 영역 */}
      <Link href={`/projects/${p.id}`} className="absolute inset-0 z-0 rounded-2xl" aria-label={`${p.title} 상세보기`} />

      <div className="relative bg-[#0f0f12] rounded-2xl p-7 space-y-5 overflow-hidden pointer-events-none">
        {/* 배경 glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full
                        bg-indigo-600/10 blur-3xl group-hover:bg-indigo-600/18 transition-all duration-500" />

        {/* 상단 메타 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase
                             bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
              Featured
            </span>
            <span className="text-xs text-zinc-500">{p.date}</span>
            <span className="text-xs text-zinc-600">/</span>
            <span className="text-xs text-zinc-500">{p.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot} animate-pulse`} />
            <span className={`text-xs font-medium ${st.text}`}>{st.label}</span>
          </div>
        </div>

        {/* 제목 */}
        <div>
          <h2 className="text-2xl font-bold text-white leading-snug group-hover:text-indigo-100 transition-colors">
            {p.title}
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{p.description}</p>
        </div>

        {/* 주요 기능 */}
        <div className="grid sm:grid-cols-2 gap-1.5">
          {p.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-zinc-400">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* 기술 스택 */}
        <div className="flex flex-wrap gap-1.5">
          {p.tech.map(t => (
            <span key={t} className="px-2.5 py-1 text-xs bg-white/5 border border-white/10
                                     text-zinc-300 rounded-lg">
              {t}
            </span>
          ))}
          {p.techCount > p.tech.length && (
            <span className="px-2.5 py-1 text-xs bg-indigo-500/10 border border-indigo-500/20
                             text-indigo-400 rounded-lg">
              +{p.techCount - p.tech.length} more
            </span>
          )}
        </div>

        {/* 하단 */}
        <div className="flex items-center justify-between pt-1 border-t border-white/8">
          <p className="text-xs text-zinc-500 line-clamp-1 mr-4">
            <span className="text-zinc-400 font-medium">성과: </span>{p.impact}
          </p>
          <ExternalLinks githubUrl={p.githubUrl} linkUrl={p.linkUrl} />
        </div>

        {/* hover 시 상세보기 텍스트 */}
        <div className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-8 overflow-hidden
                        bg-gradient-to-r from-indigo-600/80 to-purple-600/80
                        flex items-center justify-center transition-all duration-300">
          <span className="text-xs text-white/90 font-medium tracking-widest uppercase">
            상세보기 →
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 일반 카드
// ---------------------------------------------------------------------------
function ProjectCard({ p }: { p: ProjectListItem }) {
  const st = statusConfig[p.status] ?? statusConfig.Completed;
  return (
    <div className="group relative bg-[#0f0f12] border border-white/8 rounded-2xl overflow-hidden
                    cursor-pointer transition-all duration-300
                    hover:border-white/20 hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5">
      <Link href={`/projects/${p.id}`} className="absolute inset-0 z-0 rounded-2xl" aria-label={`${p.title} 상세보기`} />

      <div className="relative z-10 p-6 space-y-4 pointer-events-none">
        {/* 상단 메타 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{p.category}</span>
            <span>/</span>
            <span>{p.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
              <span className={`text-xs font-medium ${st.text}`}>{st.label}</span>
            </div>
            <ExternalLinks githubUrl={p.githubUrl} linkUrl={p.linkUrl} />
          </div>
        </div>

        {/* 제목 + 설명 */}
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-zinc-200 transition-colors">
            {p.title}
          </h3>
          <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{p.description}</p>
        </div>

        {/* 통계 */}
        <div className="flex gap-4 text-xs text-zinc-500">
          <span><span className="text-white font-semibold">{p.serviceCount}</span> Services</span>
          <span><span className="text-white font-semibold">{p.techCount}</span> Tech</span>
        </div>

        {/* 주요 기능 */}
        <div className="grid sm:grid-cols-2 gap-1">
          {p.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-zinc-500">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* 기술 스택 */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/6">
          {p.tech.map(t => (
            <span key={t} className="px-2 py-0.5 text-xs bg-white/5 text-zinc-400 rounded-md border border-white/8">
              {t}
            </span>
          ))}
          {p.techCount > p.tech.length && (
            <span className="px-2 py-0.5 text-xs text-zinc-600 border border-white/6 rounded-md">
              +{p.techCount - p.tech.length}
            </span>
          )}
        </div>
      </div>

      {/* hover 하단 바 */}
      <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-300
                      bg-white/5 flex items-center justify-center">
        <span className="text-[11px] text-zinc-400 font-medium tracking-widest uppercase">
          상세보기 →
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered =
    selectedCategory === 'All'
      ? projects
      : projects.filter(p => p.category === selectedCategory);

  const [featured, ...rest] = filtered;

  return (
    <div
      className="min-h-screen bg-[#08080b] py-16"
      style={{
        backgroundImage: 'radial-gradient(circle, #1c1c22 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── 페이지 헤더 ── */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-2">
                Portfolio
              </p>
              <h1 className="text-5xl font-black text-white tracking-tight">Projects</h1>
            </div>
            <span className="text-sm text-zinc-600 pb-1">{projects.length} projects</span>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── 카드 목록 ── */}
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-600 py-20">해당 카테고리의 프로젝트가 없습니다.</p>
        ) : (
          <div className="space-y-6">
            {/* 첫 번째 → Featured 카드 */}
            {featured && <FeaturedCard p={featured} />}

            {/* 나머지 → 일반 카드 */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-1 gap-6">
                {rest.map(p => <ProjectCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
