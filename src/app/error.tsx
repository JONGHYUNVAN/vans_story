'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { BiError } from 'react-icons/bi';
import { FaTools, FaHammer } from 'react-icons/fa';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; statusCode?: number };
  reset: () => void;
}) {
  useEffect(() => {
    // 오류 로깅
    console.error(error);
  }, [error]);

  // 404 에러인지 확인 (메시지에 '404'가 포함되어 있거나 statusCode가 404인 경우)
  const is404Error = error.message?.includes('404') || error.statusCode === 404;

  if (is404Error) {
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
          <div className="absolute inset-0 bg-gradient-radial from-yellow-500/10 via-transparent to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto p-8 backdrop-blur-sm bg-black/30 rounded-lg border border-yellow-800/30 shadow-2xl">
          <div className="text-center space-y-6">
            <div className="flex justify-center items-center">
              <FaTools className="w-20 h-20 mx-auto text-yellow-500/80" />
              <FaHammer className="w-16 h-16 mx-auto text-yellow-400/90 -ml-4 mt-4 animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
            
            <h1 className="text-6xl font-bold text-white">준비 중</h1>
            
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDuration: '1s' }}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDuration: '1s', animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDuration: '1s', animationDelay: '0.4s' }}></div>
            </div>
            
            <h2 className="text-2xl font-semibold text-yellow-300/90">
              열심히 개발 중입니다
            </h2>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              요청하신 페이지는 현재 개발 중입니다. 조금만 기다려주시면 곧 만나보실 수 있습니다.
            </p>
            
            <div className="pt-6 flex flex-col md:flex-row gap-4 justify-center">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-600/30 hover:bg-yellow-600/50 text-white transition-all duration-300 border border-yellow-600/30"
              >
                <FaHome />
                홈으로 이동
              </Link>
              <Link 
                href="/post" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 border border-white/10"
              >
                모든 게시글 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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