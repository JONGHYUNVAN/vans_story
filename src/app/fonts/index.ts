import { Inter, Noto_Sans_KR, Roboto_Mono, Gamja_Flower, Dancing_Script } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
});

// 코드 블록을 위한 모노스페이스 폰트
export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

// 한글 필기체
export const gamjaFlower = Gamja_Flower({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gamja',
});

// 영문 필기체
export const dancingScript = Dancing_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dancing',
}); 