interface ProjectHeaderProps {
  title?: string;
  description?: string;
}

export default function ProjectHeader({ 
  title = "Projects", 
  description = "개발 프로젝트들과 아키텍처를 소개합니다." 
}: ProjectHeaderProps) {
  return (
    <div className="text-center mb-12 bg-gray-800 p-8 rounded-lg">
      <h1 className="text-4xl font-bold text-white mb-4">
        {title}
      </h1>
      <p className="text-lg text-gray-300">
        {description}
      </p>
    </div>
  );
} 