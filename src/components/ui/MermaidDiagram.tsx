'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className = '' }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 동적으로 mermaid를 import
        const mermaid = (await import('mermaid')).default;

        // Mermaid 초기화
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 14,
          themeVariables: {
            primaryColor: '#1976d2',
            primaryTextColor: '#000000',
            primaryBorderColor: '#1976d2',
            lineColor: '#424242',
            secondaryColor: '#388e3c',
            tertiaryColor: '#f57c00',
            background: '#fafafa',
            mainBkg: '#fafafa',
            secondBkg: '#f5f5f5',
            edgeLabelBackground: '#ffffff',
            clusterBkg: '#f5f5f5',
            clusterBorder: '#cccccc'
          }
        });

        // 고유한 ID 생성
        const diagramId = `mermaid-diagram-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        
        // SVG 렌더링
        const { svg: renderedSvg } = await mermaid.render(diagramId, chart);
        setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid 렌더링 에러:', err);
        setError(err instanceof Error ? err.message : '다이어그램 렌더링 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (chart && chart.trim()) {
      renderDiagram();
    }
  }, [chart]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">다이어그램 로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-800 font-medium">다이어그램 렌더링 오류</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div 
      className={`mermaid-container relative bg-gray-50 border border-gray-300 rounded-lg p-6 my-6 overflow-auto shadow-md ${className}`}
      ref={elementRef}
      style={{ 
        minHeight: '200px',
        maxWidth: '100%',
        backgroundColor: '#fafafa'
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidDiagram; 