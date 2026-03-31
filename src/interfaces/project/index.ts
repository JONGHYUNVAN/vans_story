/**
 * 프로젝트 서비스 인터페이스
 */
export interface ProjectService {
  name: string;
  description: string;
  tech: string[];
  features: string[];
}

/**
 * 프로젝트 아키텍처 인터페이스
 */
export interface ProjectArchitecture {
  description: string;
  benefits: string[];
  imagePath?: string;   // custom diagram path; if omitted, defaults to Architecture_Diagram.webp
}

/**
 * 프로젝트 인터페이스
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  deployUrl: string;
  githubUrl: string;
  status: string;
  date: string;
  category: string;
  services: ProjectService[];
  architecture: ProjectArchitecture;
  impact: string;
  totalTech: string[];
} 