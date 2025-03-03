import type { Metadata } from "next";
import { inter, notoSansKr, robotoMono, gamjaFlower, dancingScript } from './fonts';
import Header from "@/components/header/Header";
import "./globals.css";
import { StoreProviders } from "../store/providers";
import LoginModal from "@/components/auth/LoginModal";
import Sidebar from "@/components/sidebar/Sidebar";

export const metadata: Metadata = {
  title: "Vans Dev Blog",
  description: "개발자 Vans의 블로그입니다. 개발 관련 경험과 지식을 공유합니다.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`
      ${inter.variable} 
      ${notoSansKr.variable} 
      ${robotoMono.variable}
      ${gamjaFlower.variable}
      ${dancingScript.variable}
    `}>
      <body className="relative">
        <StoreProviders>
          <Header />
          <Sidebar />
          <main>
            <LoginModal />
            {children}
          </main>
        </StoreProviders>
      </body>
    </html>
  );
}
