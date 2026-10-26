'use client';

import Link from 'next/link';
import { MdConstruction } from 'react-icons/md';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-black p-4 text-white">
      {/* 배경 효과 - 작은 도트 */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* 움직이는 그라데이션 효과 */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-0 right-0 left-0 h-64 animate-pulse bg-gradient-radial from-yellow-500/10 via-transparent to-transparent"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute right-0 bottom-0 left-0 h-64 animate-pulse bg-gradient-radial from-blue-500/10 via-transparent to-transparent"
          style={{ animationDuration: '6s' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-gray-700/50 bg-gray-900/60 shadow-2xl backdrop-blur-lg">
        <div className="absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-yellow-500 via-orange-500 to-red-500" />

        <div className="p-8">
          <div className="mb-6 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-linear-to-br from-yellow-400 to-orange-500 opacity-30 blur-lg" />
              <div className="relative rounded-full border border-gray-700 bg-linear-to-br from-gray-800 to-gray-900 p-4">
                <MdConstruction className="h-12 w-12 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-4xl font-bold text-transparent">
              페이지를 개발 중입니다
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-lg text-gray-300">
              요청하신 페이지는 현재 작업 중입니다.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="flex w-full items-center justify-center rounded-lg bg-linear-to-r from-yellow-500 to-orange-500 px-6 py-3 text-center font-medium text-white transition-all duration-300 hover:from-yellow-400 hover:to-orange-400 sm:w-auto"
            >
              홈페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
