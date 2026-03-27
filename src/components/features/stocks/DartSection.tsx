'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DartDisclosure, StocksApiResponse, DartData } from '@/types/stocks';
import { KR_STOCKS } from '@/types/stocks';
import { API_URLS } from '@/constants/apiUrl';

function formatDate(raw: string): string {
  // YYYYMMDD → YYYY.MM.DD
  if (/^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}`;
  }
  return raw;
}

function SkeletonRow() {
  return (
    <div className="animate-pulse border-b border-gray-800 py-3">
      <div className="h-4 bg-gray-800 rounded w-full mb-1.5" />
      <div className="h-3 bg-gray-800 rounded w-1/3" />
    </div>
  );
}

export default function DartSection() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(KR_STOCKS[0].symbol);
  const [disclosures, setDisclosures] = useState<DartDisclosure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDartKeyMissing, setIsDartKeyMissing] = useState(false);

  const fetchDart = useCallback(async (symbol: string) => {
    setIsLoading(true);
    setIsError(false);
    setIsDartKeyMissing(false);

    try {
      const res = await fetch(`${API_URLS.STOCKS.DART}?symbol=${encodeURIComponent(symbol)}`);
      const json: StocksApiResponse<DartData> = await res.json();

      if (json.success) {
        // 빈 배열이면서 공시가 없는 경우 → dart key 미설정 또는 진짜 없음
        // route에서 key 없으면 [] 반환하므로, 별도 헤더 없이 판별 불가
        // 간단하게: 빈 배열이면 isDartKeyMissing 상태 체크 없이 표시
        setDisclosures(json.data.disclosures);
      } else {
        throw new Error(json.error.message);
      }
    } catch {
      setIsError(true);
      setDisclosures([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDart(selectedSymbol);
  }, [selectedSymbol, fetchDart]);

  const selectedStock = KR_STOCKS.find((s) => s.symbol === selectedSymbol);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
        <span className="w-1 h-4 bg-orange-400 rounded-full inline-block" />
        DART 공시
        <span className="text-gray-500 text-xs font-normal">(최근 30일)</span>
      </h2>

      {/* 종목 선택 탭 */}
      <div className="flex gap-1.5 mb-4 border-b border-gray-800 pb-3">
        {KR_STOCKS.map((s) => (
          <button
            key={s.symbol}
            onClick={() => setSelectedSymbol(s.symbol)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors duration-150 ${
              selectedSymbol === s.symbol
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* 공시 목록 */}
      {isLoading ? (
        <div>
          {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <p className="text-gray-500 text-sm">공시를 불러오지 못했습니다.</p>
          <button
            onClick={() => fetchDart(selectedSymbol)}
            className="px-3 py-1.5 bg-gray-800 text-gray-300 text-xs rounded-lg border border-gray-700 hover:bg-gray-700 hover:text-white transition-colors"
          >
            다시 시도
          </button>
        </div>
      ) : isDartKeyMissing ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 text-sm">DART API 키 미설정 — 공시 조회가 비활성화되어 있습니다.</p>
        </div>
      ) : disclosures.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 text-sm">
            {selectedStock?.name} 최근 30일 공시가 없거나 DART API 키가 설정되지 않았습니다.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-800">
          {disclosures.map((d) => (
            <li key={d.receiptNo} className="py-3 first:pt-0 last:pb-0">
              <a
                href={d.detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <p className="text-gray-200 text-sm leading-snug group-hover:text-white transition-colors mb-1">
                  {d.reportName}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-gray-400">{d.filerName}</span>
                  <span>·</span>
                  <span>{formatDate(d.receiptDate)}</span>
                  {d.remark && (
                    <>
                      <span>·</span>
                      <span className="text-yellow-600">{d.remark}</span>
                    </>
                  )}
                  <span className="ml-auto text-blue-400 group-hover:text-blue-300 transition-colors">
                    DART 상세 →
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
