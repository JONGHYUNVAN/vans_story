'use client';

import { useState } from 'react';
import Link from 'next/link';
import { vansDevBlogProject, stockDashboardProject } from '@/constants/projects';
import type { Project } from '@/types/project';

// ---------------------------------------------------------------------------
// 목록 아이템 타입
// ---------------------------------------------------------------------------
interface ProjectListItem {
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
}

function toListItem(p: Project): ProjectListItem {
  const features = p.services.flatMap((s) => s.features.slice(0, 2)).slice(0, 6);
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
  Deployed: { label: '배포중', dot: 'bg-emerald-400', text: 'text-emerald-400' },
  Completed: { label: '완료', dot: 'bg-sky-400', text: 'text-sky-400' },
  InProgress: { label: '진행중', dot: 'bg-amber-400', text: 'text-amber-400' },
};

// ---------------------------------------------------------------------------
// 서브 컴포넌트 — 카드 공통 외부링크 버튼
// ---------------------------------------------------------------------------
function ExternalLinks({ githubUrl, linkUrl }: { githubUrl: string; linkUrl: string }) {
  return (
    <div className="pointer-events-auto relative z-20 flex shrink-0 gap-2">
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:border-white/30 hover:text-white"
        >
          GitHub
        </a>
      )}
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-white/20"
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
    <div className="group relative cursor-pointer rounded-2xl bg-linear-to-br from-indigo-500/60 via-purple-500/30 to-indigo-500/10 p-px transition-all duration-300 hover:from-indigo-400/80 hover:via-purple-400/50 hover:to-indigo-400/20">
      {/* 전체 클릭 영역 */}
      <Link
        href={`/projects/${p.id}`}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={`${p.title} 상세보기`}
      />

      <div className="pointer-events-none relative space-y-5 overflow-hidden rounded-2xl bg-[#0f0f12] p-7">
        {/* 배경 glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl transition-all duration-500 group-hover:bg-indigo-600/18" />

        {/* 상단 메타 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold tracking-widest text-indigo-300 uppercase">
              Featured
            </span>
            <span className="text-xs text-zinc-500">{p.date}</span>
            <span className="text-xs text-zinc-600">/</span>
            <span className="text-xs text-zinc-500">{p.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${st.dot} animate-pulse`} />
            <span className={`text-xs font-medium ${st.text}`}>{st.label}</span>
          </div>
        </div>

        {/* 제목 */}
        <div>
          <h2 className="text-2xl leading-snug font-bold text-white transition-colors group-hover:text-indigo-100">
            {p.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.description}</p>
        </div>

        {/* 주요 기능 */}
        <div className="grid gap-1.5 sm:grid-cols-2">
          {p.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-zinc-400">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* 기술 스택 */}
        <div className="flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <span
              key={t}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300"
            >
              {t}
            </span>
          ))}
          {p.techCount > p.tech.length && (
            <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-400">
              +{p.techCount - p.tech.length} more
            </span>
          )}
        </div>

        {/* 하단 */}
        <div className="flex items-center justify-between border-t border-white/8 pt-1">
          <p className="mr-4 line-clamp-1 text-xs text-zinc-500">
            <span className="font-medium text-zinc-400">성과: </span>
            {p.impact}
          </p>
          <ExternalLinks githubUrl={p.githubUrl} linkUrl={p.linkUrl} />
        </div>

        {/* hover 시 상세보기 텍스트 */}
        <div className="absolute right-0 bottom-0 left-0 flex h-0 items-center justify-center overflow-hidden bg-linear-to-r from-indigo-600/80 to-purple-600/80 transition-all duration-300 group-hover:h-8">
          <span className="text-xs font-medium tracking-widest text-white/90 uppercase">
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
    <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/8 bg-[#0f0f12] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg hover:shadow-black/40">
      <Link
        href={`/projects/${p.id}`}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={`${p.title} 상세보기`}
      />

      <div className="pointer-events-none relative z-10 space-y-4 p-6">
        {/* 상단 메타 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{p.category}</span>
            <span>/</span>
            <span>{p.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
              <span className={`text-xs font-medium ${st.text}`}>{st.label}</span>
            </div>
            <ExternalLinks githubUrl={p.githubUrl} linkUrl={p.linkUrl} />
          </div>
        </div>

        {/* 제목 + 설명 */}
        <div>
          <h3 className="text-lg font-bold text-white transition-colors group-hover:text-zinc-200">
            {p.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{p.description}</p>
        </div>

        {/* 통계 */}
        <div className="flex gap-4 text-xs text-zinc-500">
          <span>
            <span className="font-semibold text-white">{p.serviceCount}</span> Services
          </span>
          <span>
            <span className="font-semibold text-white">{p.techCount}</span> Tech
          </span>
        </div>

        {/* 주요 기능 */}
        <div className="grid gap-1 sm:grid-cols-2">
          {p.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-zinc-500">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* 기술 스택 */}
        <div className="flex flex-wrap gap-1.5 border-t border-white/6 pt-1">
          {p.tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/8 bg-white/5 px-2 py-0.5 text-xs text-zinc-400"
            >
              {t}
            </span>
          ))}
          {p.techCount > p.tech.length && (
            <span className="rounded-md border border-white/6 px-2 py-0.5 text-xs text-zinc-600">
              +{p.techCount - p.tech.length}
            </span>
          )}
        </div>
      </div>

      {/* hover 하단 바 */}
      <div className="flex h-0 items-center justify-center overflow-hidden bg-white/5 transition-all duration-300 group-hover:h-8">
        <span className="text-[11px] font-medium tracking-widest text-zinc-400 uppercase">
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
    selectedCategory === 'All' ? projects : projects.filter((p) => p.category === selectedCategory);

  const [featured, ...rest] = filtered;

  return (
    <div
      className="min-h-screen bg-[#08080b] py-16"
      style={{
        backgroundImage: 'radial-gradient(circle, #1c1c22 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* ── 페이지 헤더 ── */}
        <div className="mb-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-indigo-400 uppercase">
                Portfolio
              </p>
              <h1 className="text-5xl font-black tracking-tight text-white">Projects</h1>
            </div>
            <span className="pb-1 text-sm text-zinc-600">{projects.length} projects</span>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-black'
                    : 'border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── 카드 목록 ── */}
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-zinc-600">해당 카테고리의 프로젝트가 없습니다.</p>
        ) : (
          <div className="space-y-6">
            {/* 첫 번째 → Featured 카드 */}
            {featured && <FeaturedCard p={featured} />}

            {/* 나머지 → 일반 카드 */}
            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-1">
                {rest.map((p) => (
                  <ProjectCard key={p.id} p={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
