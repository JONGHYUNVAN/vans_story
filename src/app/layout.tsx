import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/header/Header";
import "./globals.css";
import { StoreProviders } from "../store/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Vans Dev Blog",
  description: "프론트엔드 개발자 Vans의 기술 블로그입니다. React, TypeScript, Next.js 등 웹 개발 관련 경험과 지식을 공유합니다.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <StoreProviders>
          <Header />
          {children}
        </StoreProviders>
      </body>
    </html>
  );
}
