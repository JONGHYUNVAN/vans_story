'use client';

import { useState } from 'react';
import { vansDevBlogProject } from '@/constants/projects';
import {
  ProjectHeader,
  ProjectCard,
  TechStack,
  Architecture,
  Services,
  Impact
} from '@/components/features/projects';

export default function VansDevBlogPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectHeader 
          title="VansDevBlog"
          description="마이크로서비스 기반 풀스택 블로그 프로젝트"
        />

        {/* VansDevBlog Project */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
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