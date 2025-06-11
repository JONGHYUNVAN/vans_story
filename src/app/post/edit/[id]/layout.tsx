interface PostEditLayoutProps {
  children: React.ReactNode
}

export default function PostEditLayout({ children }: PostEditLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-lg mx-auto py-12 px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          {children}
        </div>
      </div>
    </div>
  )
} 