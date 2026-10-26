'use client';

import { useState } from 'react';
import { vansDevBlogProject } from '@/constants/projects';
import {
  ProjectHeader,
  ProjectCard,
  TechStack,
  Architecture,
  Services,
  Impact,
} from '@/components/features/projects';

export default function VansDevBlogPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProjectHeader
          title="VansDevBlog"
          description="마이크로서비스 기반 풀스택 블로그 프로젝트"
        />

        {/* VansDevBlog Project */}
        <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
          <ProjectCard project={vansDevBlogProject} />
          <TechStack
            technologies={vansDevBlogProject.totalTech}
            selectedTech={selectedTech}
            onTechSelect={setSelectedTech}
          />
          <Architecture architecture={vansDevBlogProject.architecture} />
          <Services
            services={vansDevBlogProject.services}
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
            selectedTech={selectedTech}
          />
          <Impact impact={vansDevBlogProject.impact} />
        </div>
      </div>
    </div>
  );
}
