'use client';

import { usePathname } from 'next/navigation';
import MainSidebar from './MainSidebar';
import NextSidebar from './NextSidebar';
import NestSidebar from './NestSidebar';
import SpringSidebar from './SpringSidebar';
import MariaDBSidebar from './MariaDBSidebar';
import MongoDBSidebar from './MongoDBSidebar';
import AlgorithmSidebar from './AlgorithmSidebar';
import DockerSidebar from './DockerSidebar';
import JWTSidebar from './JWTSidebar';
import DatabaseTheorySidebar from './DatabaseTheorySidebar';

export default function Sidebar() {
  const pathname = usePathname();
  const isNextjsPage = pathname.startsWith('/post/view/nextjs');
  const isNestjsPage = pathname.startsWith('/post/view/nestjs');
  const isSpringPage = pathname.startsWith('/post/view/spring');
  const isMariaPage = pathname.startsWith('/post/view/mariadb');
  const isMongoPage = pathname.startsWith('/post/view/mongodb');
  const isAlgorithmPage = pathname.startsWith('/post/view/algorithm');
  const isDockerPage = pathname.startsWith('/post/view/docker');
  const isJWTPage = pathname.startsWith('/post/view/jwt');
  const isDatabaseTheoryPage = pathname.startsWith('/post/view/database-theory');

  return (
    <aside className="fixed left-0 top-0 h-full z-[30] overflow-hidden">
      {isNextjsPage ? <NextSidebar /> 
        : isNestjsPage ? <NestSidebar /> 
        : isSpringPage ? <SpringSidebar />
        : isMariaPage ? <MariaDBSidebar />
        : isMongoPage ? <MongoDBSidebar />
        : isAlgorithmPage ? <AlgorithmSidebar />
        : isDockerPage ? <DockerSidebar />
        : isJWTPage ? <JWTSidebar/>
        : isDatabaseTheoryPage ? <DatabaseTheorySidebar />
        : <MainSidebar />}
    </aside>
  );
}
