export default function NewPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111111] py-12">
      <div className="container mx-auto max-w-5xl px-4">
        {children}
      </div>
    </div>
  )
} 