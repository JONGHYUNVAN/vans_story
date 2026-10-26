'use client';

import { useRouter } from 'next/navigation';

interface ViewPostHeaderProps {
  postId: string;
}

export function ViewPostHeader({ postId }: ViewPostHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 border-b border-gray-100/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-gamjaFlower text-xl text-white">게시글 보기</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
              onClick={() => {
                router.push(`/post/edit/${postId}`);
              }}
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
