import { Metadata } from 'next';
import StocksClient from './StocksClient';

export const metadata: Metadata = {
  title: '주가 대시보드 | Vans Story',
  description: '한국/미국 테크주 실시간 주가 및 관련 정보',
};

export default function StocksPage() {
  return <StocksClient />;
}
