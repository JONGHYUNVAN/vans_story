import { Project } from '@/interfaces/project';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {project.title}
        </h2>
        <p className="text-gray-600 text-lg mb-4">
          {project.description}
        </p>
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {project.status}
          </span>
          <span className="text-gray-500">{project.date}</span>
          <span className="text-gray-500">{project.category}</span>
        </div>
        <div className="flex gap-4">
          <a
            href={project.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            사이트 방문
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
} 