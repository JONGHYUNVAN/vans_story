import Image from 'next/image';
import type { ProjectArchitecture } from '@/types/project';

interface ArchitectureProps {
  architecture: ProjectArchitecture;
}

export default function Architecture({ architecture }: ArchitectureProps) {
  const figmaEmbedUrl = architecture.figmaUrl
    ? `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(architecture.figmaUrl)}`
    : null;
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-xl font-semibold">아키텍처</h3>
      <p className="mb-4 whitespace-pre-line text-gray-600">{architecture.description}</p>

      {/* 서비스 아키텍처 다이어그램 */}
      <div className="mb-6">
        {figmaEmbedUrl ? (
          <div
            className="relative w-full overflow-hidden rounded-lg border border-gray-200 shadow-xs"
            style={{ paddingBottom: '62.5%' }}
          >
            <iframe
              src={figmaEmbedUrl}
              className="absolute inset-0 h-full w-full"
              allowFullScreen
            />
          </div>
        ) : (
          <Image
            src={architecture.imagePath ?? '/Architecture_Diagram.webp'}
            alt={
              architecture.imagePath
                ? (architecture.imagePath.split('/').pop() ?? 'Architecture Diagram')
                : '아키텍처 다이어그램'
            }
            width={800}
            height={600}
            className="h-auto w-full rounded-lg border border-gray-200 shadow-xs"
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {architecture.benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            <span className="text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
