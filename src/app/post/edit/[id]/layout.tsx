interface PostEditLayoutProps {
  children: React.ReactNode;
}

export default function PostEditLayout({ children }: PostEditLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-screen-lg px-4 py-12">
        <div className="rounded-lg border border-gray-200 bg-white p-8">{children}</div>
      </div>
    </div>
  );
}
