import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h2 className="mb-2 text-3xl font-bold text-gray-900">{project.title}</h2>
        <p className="mb-4 whitespace-pre-line text-lg text-gray-600">{project.description}</p>
        <div className="mb-4 flex items-center gap-4">
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
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
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            사이트 방문
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-900"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
