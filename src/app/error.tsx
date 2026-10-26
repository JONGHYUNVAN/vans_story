'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FaHome, FaTools, FaHammer } from 'react-icons/fa';
import { BiError } from 'react-icons/bi';

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
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(#80808020 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>
        {/* 애니메이션 효과 */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 animate-pulse bg-gradient-radial from-yellow-500/10 via-transparent to-transparent"
            style={{ animationDuration: '4s' }}
          />
          <div
            className="absolute inset-0 animate-pulse bg-gradient-radial from-blue-500/10 via-transparent to-transparent"
            style={{ animationDuration: '6s', animationDelay: '2s' }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl rounded-lg border border-yellow-800/30 bg-black/30 p-8 shadow-2xl backdrop-blur-sm">
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center">
              <FaTools className="mx-auto h-20 w-20 text-yellow-500/80" />
              <FaHammer
                className="mx-auto -ml-4 mt-4 h-16 w-16 animate-bounce text-yellow-400/90"
                style={{ animationDuration: '2s' }}
              />
            </div>

            <h1 className="text-6xl font-bold text-white">준비 중</h1>

            <div className="flex items-center justify-center space-x-2">
              <div
                className="h-3 w-3 animate-pulse rounded-full bg-yellow-500"
                style={{ animationDuration: '1s' }}
              />
              <div
                className="h-3 w-3 animate-pulse rounded-full bg-yellow-500"
                style={{ animationDuration: '1s', animationDelay: '0.2s' }}
              />
              <div
                className="h-3 w-3 animate-pulse rounded-full bg-yellow-500"
                style={{ animationDuration: '1s', animationDelay: '0.4s' }}
              />
            </div>

            <h2 className="text-2xl font-semibold text-yellow-300/90">열심히 개발 중입니다</h2>

            <p className="mx-auto max-w-2xl text-lg text-gray-300">
              요청하신 페이지는 현재 개발 중입니다. 조금만 기다려주시면 곧 만나보실 수 있습니다.
            </p>

            <div className="flex flex-col justify-center gap-4 pt-6 md:flex-row">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg border border-yellow-600/30 bg-yellow-600/30 px-6 py-3 text-white transition-all duration-300 hover:bg-yellow-600/50"
              >
                <FaHome />
                홈으로 이동
              </Link>
              <Link
                href="/post"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-6 py-3 text-white transition-all duration-300 hover:bg-white/20"
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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(#80808020 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>
      {/* 애니메이션 효과 */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 animate-pulse bg-gradient-radial from-purple-500/5 via-transparent to-transparent"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute inset-0 animate-pulse bg-gradient-radial from-blue-500/5 via-transparent to-transparent"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl rounded-lg border border-gray-800 bg-black/30 p-8 shadow-2xl backdrop-blur-sm">
        <div className="space-y-6 text-center">
          <BiError className="mx-auto h-32 w-32 text-red-500/80" />

          <h1 className="text-4xl font-bold text-white">문제가 발생했습니다</h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            요청을 처리하는 중에 오류가 발생했습니다. 다시 시도하거나 홈으로 돌아가세요.
          </p>

          <div className="flex flex-col justify-center gap-4 pt-6 md:flex-row">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600/80 px-6 py-3 text-white transition-all duration-300 hover:bg-blue-600"
            >
              다시 시도
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-6 py-3 text-white transition-all duration-300 hover:bg-white/20"
            >
              <FaHome />
              홈으로 이동
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 rounded-lg bg-gray-900/50 p-4 text-left">
              <h3 className="mb-2 text-lg font-medium text-red-400">오류 정보 (개발 모드):</h3>
              <p className="break-all font-mono text-sm text-gray-400">
                {error.message || '알 수 없는 오류'}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-gray-500">
                    스택 트레이스 보기
                  </summary>
                  <pre className="mt-2 max-h-40 overflow-auto rounded bg-black/50 p-2 text-xs text-gray-500">
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
