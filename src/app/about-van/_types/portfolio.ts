export interface TechStack {
  name: string;
  level: number;
  icon: string;
}

export interface TechCategory {
  title: string;
  icon: string;
  color: string;
  techs: TechStack[];
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  period: string;
  location: string;
  type: string;
  description: string;
  achievements: string[];
  tech: string[];
  color: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  tech: string[];
  features: string[];
  github: string;
  demo: string;
  year: string;
}

export interface Skill {
  name: string;
  level: number;
  description: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

export interface SocialLink {
  name: string;
  icon: string;
  url: string;
  description: string;
  color: string;
}

export interface ContactInfo {
  label: string;
  value: string;
  icon: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
} 