'use client';

import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import AuthButtons from './AuthButtons';

export default function Header() {
  return (
    <header className="w-full border-b relative z-50">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Van's Dev Blog
        </Link>
        
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <AuthButtons />
        </div>
      </nav>
    </header>
  );
} 