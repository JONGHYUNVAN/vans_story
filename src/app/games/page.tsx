import { Metadata } from 'next';
import GamesClient from './GamesClient';

export const metadata: Metadata = {
  title: '미니 게임 | Vans Story',
  description: '코딩 쉬는 시간, 간단한 미니 게임 한 판',
};

export default function GamesPage() {
  return <GamesClient />;
}
