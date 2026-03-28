'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DartDisclosure, StocksApiResponse, DartData } from '@/types/stocks';
import { KR_STOCKS } from '@/types/stocks';
import { API_URLS } from '@/constants/apiUrl';
import { useStocksTheme } from '@/components/features/stocks/StocksThemeContext';

function formatDate(raw: string): string {
  if (/^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}`;
  }
  return raw;
}

interface DartSectionProps {
  fixedSymbol?: string;
}

export default function DartSection({ fixedSymbol }: DartSectionProps = {}) {
  const { tokens: t } = useStocksTheme();
  const d = t.dart;
  const [selectedSymbol, setSelectedSymbol] = useState<string>(fixedSymbol ?? KR_STOCKS[0].symbol);

  useEffect(() => {
    if (fixedSymbol) setSelectedSymbol(fixedSymbol);
  }, [fixedSymbol]);
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
    <div className={d.panel}>
      <div className={d.headerRule}>
        <h2 className={d.title}>
          DART 공시
          <span className={d.titleMuted}>(30일)</span>
        </h2>
        <span className={d.meta}>Filings</span>
      </div>

      {!fixedSymbol && (
        <div className={d.chipRowRule}>
          {KR_STOCKS.map((s) => (
            <button
              key={s.symbol}
              type="button"
              onClick={() => setSelectedSymbol(s.symbol)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedSymbol === s.symbol ? d.chipOn : d.chipOff
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={d.skeletonRow}>
              <div className={`h-4 ${d.skeletonBar} w-full mb-1.5`} />
              <div className={`h-3 ${d.skeletonBar} w-1/3`} />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <p className={d.empty}>공시를 불러오지 못했습니다.</p>
          <button type="button" onClick={() => fetchDart(selectedSymbol)} className={d.retry}>
            다시 시도
          </button>
        </div>
      ) : isDartKeyMissing ? (
        <div className="flex items-center justify-center py-8">
          <p className={d.empty}>DART API 키 미설정 — 공시 조회가 비활성화되어 있습니다.</p>
        </div>
      ) : disclosures.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className={d.empty}>
            {selectedStock?.name} 최근 30일 공시가 없거나 DART API 키가 설정되지 않았습니다.
          </p>
        </div>
      ) : (
        <ul className={d.divide}>
          {disclosures.map((x) => (
            <li key={x.receiptNo} className="py-3 first:pt-0 last:pb-0">
              <a href={x.detailUrl} target="_blank" rel="noopener noreferrer" className="group block">
                <p className={`${d.itemTitle} ${d.itemTitleHover}`}>{x.reportName}</p>
                <div className={d.itemMeta}>
                  <span className={d.itemSource}>{x.filerName}</span>
                  <span>·</span>
                  <span>{formatDate(x.receiptDate)}</span>
                  {x.remark && (
                    <>
                      <span>·</span>
                      <span className={d.remark}>{x.remark}</span>
                    </>
                  )}
                  <span className={`${d.link} ${d.linkHover}`}>DART 상세 →</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
