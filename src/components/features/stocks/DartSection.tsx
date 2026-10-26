'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DartDisclosure, StocksApiResponse, DartData } from '@/types/stocks';
import { KR_STOCKS } from '@/types/stocks';
import { API_URLS } from '@/constants/apiUrl';
import { useStocksTheme } from './StocksThemeContext';

function formatDate(raw: string): string {
  if (/^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}`;
  }
  return raw;
}

interface DartSectionProps {
  fixedSymbol?: string;
}

interface DartResult {
  /** 어떤 요청(symbol:재시도 횟수)에 대한 결과인지 */
  requestKey: string;
  disclosures: DartDisclosure[];
  isError: boolean;
}

export default function DartSection({ fixedSymbol }: DartSectionProps = {}) {
  const { tokens: t } = useStocksTheme();
  const d = t.dart;
  const [selectedSymbol, setSelectedSymbol] = useState<string>(fixedSymbol ?? KR_STOCKS[0].symbol);

  // fixedSymbol prop이 바뀌면 렌더 중에 선택 종목 동기화
  const [prevFixedSymbol, setPrevFixedSymbol] = useState(fixedSymbol);
  if (prevFixedSymbol !== fixedSymbol) {
    setPrevFixedSymbol(fixedSymbol);
    if (fixedSymbol) setSelectedSymbol(fixedSymbol);
  }

  // 요청 키와 결과 키를 비교해 로딩 여부를 파생 (effect 내 동기 setState 없이 처리)
  const [retryCount, setRetryCount] = useState(0);
  const requestKey = `${selectedSymbol}:${retryCount}`;
  const [result, setResult] = useState<DartResult | null>(null);
  const isLoading = result?.requestKey !== requestKey;
  const disclosures = result?.disclosures ?? [];
  const isError = result?.isError ?? false;
  const isDartKeyMissing = false;

  const retry = useCallback(() => setRetryCount((c) => c + 1), []);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URLS.STOCKS.DART}?symbol=${encodeURIComponent(selectedSymbol)}`)
      .then((res) => res.json())
      .then((json: StocksApiResponse<DartData>) => {
        if (!json.success) throw new Error(json.error.message);
        if (!cancelled) {
          setResult({ requestKey, disclosures: json.data.disclosures, isError: false });
        }
      })
      .catch(() => {
        if (!cancelled) setResult({ requestKey, disclosures: [], isError: true });
      });

    // 종목 변경·재시도 시 이전 요청의 응답은 무시
    return () => {
      cancelled = true;
    };
  }, [selectedSymbol, requestKey]);

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
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
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
              <div className={`h-4 ${d.skeletonBar} mb-1.5 w-full`} />
              <div className={`h-3 ${d.skeletonBar} w-1/3`} />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <p className={d.empty}>공시를 불러오지 못했습니다.</p>
          <button type="button" onClick={retry} className={d.retry}>
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
              <a
                href={x.detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
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
