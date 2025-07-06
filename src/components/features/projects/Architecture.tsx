import { ProjectArchitecture } from '@/interfaces/project';
import Image from 'next/image';

interface ArchitectureProps {
  architecture: ProjectArchitecture;
}

export default function Architecture({ architecture }: ArchitectureProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">아키텍처</h3>
      <p className="text-gray-600 mb-4">{architecture.description}</p>
      
      {/* 아키텍처 다이어그램 */}
      <div className="mb-6">
        <Image
          src="/Architecture_Diagram.webp"
          alt="마이크로서비스 아키텍처 다이어그램"
          width={800}
          height={600}
          className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {architecture.benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 