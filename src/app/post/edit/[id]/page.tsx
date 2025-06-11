import { PostEditForm } from "./components/PostEditForm";
import { Suspense } from "react";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="text-center py-8">로딩 중...</div>}>
      <PostEditForm postId={id} />
    </Suspense>
  );
} 