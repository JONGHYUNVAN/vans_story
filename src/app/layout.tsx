import type { Metadata } from "next";
import { inter, notoSansKr, robotoMono, gamjaFlower, dancingScript } from './fonts';
import Header from "@/components/header/Header";
import "./globals.css";
import { StoreProviders } from "../store/providers";

export const metadata: Metadata = {
  title: "Vans Dev Blog",
  description: "프론트엔드 개발자 Vans의 기술 블로그입니다. React, TypeScript, Next.js 등 웹 개발 관련 경험과 지식을 공유합니다.",
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
      <body>
        <StoreProviders>
          <Header />
          {children}
        </StoreProviders>
      </body>
    </html>
  );
}
