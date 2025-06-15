import { SiNestjs, SiSpring, SiMariadb, SiMongodb, SiNextdotjs, 
         SiDocker, SiJest, SiCypress, SiGit, SiJunit5 } from "react-icons/si";
import { TbBinaryTree2, TbDatabase } from "react-icons/tb";
import { RiShieldKeyholeLine } from "react-icons/ri";
import NextSidebar from '../../components/layout/sidebar/post/NextSidebar';
import NestSidebar from '../../components/layout/sidebar/post/NestSidebar';
import SpringSidebar from '../../components/layout/sidebar/post/SpringSidebar';
import MariaDBSidebar from '../../components/layout/sidebar/post/MariaDBSidebar';
import MongoDBSidebar from '../../components/layout/sidebar/post/MongoDBSidebar';
import AlgorithmSidebar from '../../components/layout/sidebar/post/AlgorithmSidebar';
import DockerSidebar from '../../components/layout/sidebar/post/DockerSidebar';
import JWTSidebar from '../../components/layout/sidebar/post/JWTSidebar';
import DatabaseTheorySidebar from '../../components/layout/sidebar/post/DatabaseTheorySidebar';

export const main_categories = {
  'Frontend': [
    { name: 'Next.js', path: '/post/view/nextjs', icon: SiNextdotjs, color: '#000000' }
  ],
  'Backend': [
    { name: 'NestJS', path: '/post/view/nestjs', icon: SiNestjs, color: '#E0234E' },
    { name: 'Spring', path: '/post/view/spring', icon: SiSpring, color: '#6DB33F' }
  ],
  'Database': [
    { name: 'Database Theory', path: '/post/view/database-theory', icon: TbDatabase, color: '#2563EB' },
    { name: 'MariaDB', path: '/post/view/mariadb', icon: SiMariadb, color: '#003545' },
    { name: 'MongoDB', path: '/post/view/mongodb', icon: SiMongodb, color: '#47A248' },
  ],
  'IT': [
    { name: 'Docker', path: '/post/view/docker', icon: SiDocker, color: '#2496ED' },
    { name: 'JWT', path: '/post/view/jwt', icon: RiShieldKeyholeLine, color: '#00B4CC' }
  ],
  'Test': [
    { name: 'Jest', path: '/post/view/jest', icon: SiJest, color: '#C21325' },
    { name: 'Cypress', path: '/post/view/cypress', icon: SiCypress, color: '#17202C' },
    { name: 'JUnit5', path: '/post/view/junit5', icon: SiJunit5, color: '#25A162' }
  ],
  'Etc': [
    { name: 'Git', path: '/post/view/git', icon: SiGit, color: '#F05032' },
    { name: 'Algorithm', path: '/post/view/algorithm', icon: TbBinaryTree2, color: '#4CAF50' }
  ]
} as const;

export const THEME_SIDEBARS = {
  'nextjs': NextSidebar,
  'nestjs': NestSidebar,
  'spring': SpringSidebar,
  'mariadb': MariaDBSidebar,
  'mongodb': MongoDBSidebar,
  'algorithm': AlgorithmSidebar,
  'docker': DockerSidebar,
  'jwt': JWTSidebar,
  'database-theory': DatabaseTheorySidebar,
} as const; 