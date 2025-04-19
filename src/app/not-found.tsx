'use client';

import Link from 'next/link';
import { MdConstruction } from 'react-icons/md';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 overflow-hidden relative">
      {/* 배경 효과 - 작은 도트 */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>
      
      {/* 움직이는 그라데이션 효과 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-radial from-yellow-500/10 via-transparent to-transparent animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-radial from-blue-500/10 via-transparent to-transparent animate-pulse" style={{ animationDuration: '6s' }} />
      </div>
      
      <div className="relative z-10 w-full max-w-xl bg-gray-900/60 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"></div>
        
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-full border border-gray-700">
                <MdConstruction className="w-12 h-12 text-yellow-400" />
              </div>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              페이지를 개발 중입니다
            </h1>
            <p className="mt-3 text-lg text-gray-300 max-w-xl mx-auto">
              요청하신 페이지는 현재 작업 중입니다.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-lg transition-all duration-300 text-white font-medium text-center flex items-center justify-center"
            >
              홈페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 