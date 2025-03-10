'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { BiError } from 'react-icons/bi';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 오류 로깅
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(#80808020 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>
      
      {/* 애니메이션 효과 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto p-8 backdrop-blur-sm bg-black/30 rounded-lg border border-gray-800 shadow-2xl">
        <div className="text-center space-y-6">
          <BiError className="w-32 h-32 mx-auto text-red-500/80" />
          
          <h1 className="text-4xl font-bold text-white">문제가 발생했습니다</h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            요청을 처리하는 중에 오류가 발생했습니다. 다시 시도하거나 홈으로 돌아가세요.
          </p>
          
          <div className="pt-6 flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white transition-all duration-300"
            >
              다시 시도
            </button>
            
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 border border-white/10"
            >
              <FaHome />
              홈으로 이동
            </Link>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-900/50 rounded-lg text-left">
              <h3 className="text-lg font-medium text-red-400 mb-2">오류 정보 (개발 모드):</h3>
              <p className="text-sm font-mono text-gray-400 break-all">
                {error.message || '알 수 없는 오류'}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-sm text-gray-500 cursor-pointer">스택 트레이스 보기</summary>
                  <pre className="mt-2 p-2 bg-black/50 rounded text-xs text-gray-500 overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 