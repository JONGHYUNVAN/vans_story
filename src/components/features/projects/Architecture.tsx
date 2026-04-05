import { ProjectArchitecture } from '@/interfaces/project';
import Image from 'next/image';

interface ArchitectureProps {
  architecture: ProjectArchitecture;
}

export default function Architecture({ architecture }: ArchitectureProps) {
  const figmaEmbedUrl = architecture.figmaUrl
    ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(architecture.figmaUrl)}`
    : null;
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">아키텍처</h3>
      <p className="text-gray-600 mb-4 whitespace-pre-line">{architecture.description}</p>

      {/* 서비스 아키텍처 다이어그램 */}
      <div className="mb-6">
        {figmaEmbedUrl ? (
          <div className="relative w-full rounded-lg border border-gray-200 shadow-sm overflow-hidden" style={{ paddingBottom: '62.5%' }}>
            <iframe
              src={figmaEmbedUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>
        ) : (
          <Image
            src={architecture.imagePath ?? '/Architecture_Diagram.webp'}
            alt={architecture.imagePath ? (architecture.imagePath.split('/').pop() ?? 'Architecture Diagram') : '아키텍처 다이어그램'}
            width={800}
            height={600}
            className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
          />
        )}
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
