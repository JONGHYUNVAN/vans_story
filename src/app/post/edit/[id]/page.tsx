import { PostEditForm } from "./components/PostEditForm";
import { Suspense } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="text-center py-8">로딩 중...</div>}>
      <PostEditForm postId={params.id} />
    </Suspense>
  );
} 