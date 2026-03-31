'use client';

import { useState } from 'react';
import { stockDashboardProject } from '@/constants/projects';
import {
  ProjectHeader,
  ProjectCard,
  TechStack,
  Architecture,
  Services,
  Impact,
} from '@/components/features/projects';

export default function StockDashboardPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectHeader
          title="주식 대시보드"
          description="KIS OpenAPI · Yahoo Finance 기반 한국·미국 실시간 주식 대시보드"
        />

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <ProjectCard project={stockDashboardProject} />
          <TechStack
            technologies={stockDashboardProject.totalTech}
            selectedTech={selectedTech}
            onTechSelect={setSelectedTech}
          />
          <Architecture architecture={stockDashboardProject.architecture} />
          <Services
            services={stockDashboardProject.services}
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
            selectedTech={selectedTech}
          />
          <Impact impact={stockDashboardProject.impact} />
        </div>
      </div>
    </div>
  );
}
