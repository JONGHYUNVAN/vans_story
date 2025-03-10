import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { BiError } from 'react-icons/bi';

export default function PostNotFound() {
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
          
          <h1 className="text-9xl font-bold text-white">404</h1>
          
          <h2 className="text-2xl font-semibold text-white/90">
            게시글을 찾을 수 없습니다
          </h2>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            요청하신 게시글이 존재하지 않거나 삭제되었을 수 있습니다.
          </p>
          
          <div className="pt-6 flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 border border-white/10"
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