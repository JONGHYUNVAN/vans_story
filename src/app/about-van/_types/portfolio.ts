// messages/<lang>/about.json 의 AboutVan.* 콘텐츠 항목 타입.
// 두 언어의 키 구조가 같아야 하며, 색상 같은 표현 정보는 토큰(tone)으로만 둔다.

export type Tone = 'blue' | 'red' | 'green' | 'purple';

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export type TechCategoryKey = 'frontend' | 'backend' | 'database';

export interface TechStackItem {
  name: string;
  category: TechCategoryKey;
  icon: string;
  tone: Tone;
  commonReason: string;
  myReason: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  company: string;
  position: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  tech: string[];
}

export type ProjectCategoryKey = 'personal' | 'team';
export type ProjectStatusKey = 'completed' | 'deployed' | 'inProgress';

export interface ProjectItem {
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  linkUrl?: string;
  category: ProjectCategoryKey;
  status: ProjectStatusKey;
  date: string;
  impact: string;
  features: string[];
}

export interface CertificationItem {
  name: string;
  fullName: string;
  issuer: string;
  date: string;
  description: string;
  icon: string;
  tone: Tone;
}
