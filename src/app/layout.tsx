import type { Metadata } from 'next';
import { inter, notoSansKr, robotoMono, gamjaFlower, dancingScript } from './fonts';
import Header from '@/components/layout/header/Header';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Sidebar from '@/components/layout/sidebar/base/Sidebar';
import LoginModal from '@/components/features/auth/LoginModal';
import { StoreProviders } from '@/store/providers';

export const metadata: Metadata = {
  title: 'Vans Dev Blog',
  description: '개발자 Vans의 블로그입니다. 개발 관련 경험과 지식을 공유합니다.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={` ${inter.variable} ${notoSansKr.variable} ${robotoMono.variable} ${gamjaFlower.variable} ${dancingScript.variable} `}
    >
      <body className="relative bg-black">
        <StoreProviders>
          <Header />
          <Sidebar />
          <main>
            <LoginModal />
            {children}
          </main>
        </StoreProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
