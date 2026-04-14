import { Metadata } from 'next';
import { getGameById, GAMES } from '@/constants/games';
import GamePageClient from './GamePageClient';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return GAMES.map(g => ({ gameId: g.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gameId: string }>;
}): Promise<Metadata> {
  const { gameId } = await params;
  const game = getGameById(gameId);
  if (!game) return { title: '게임을 찾을 수 없습니다' };
  return {
    title: `${game.title} | Vans Story`,
    description: game.description,
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const game = getGameById(gameId);
  if (!game) notFound();
  return <GamePageClient gameId={gameId} />;
}
