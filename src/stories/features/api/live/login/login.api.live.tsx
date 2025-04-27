"use client";
import { useState, useEffect } from 'react';
import { LoginApiCard } from '../../login.api.card';

interface Props {
  endpoint: string;
  method?: 'POST';
  body: any;
}

export default function LoginApiLive({ endpoint, method = 'POST', body }: Props) {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [authHeader, setAuthHeader] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('accessToken');
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const result = await fetch(endpoint, {
          method,
          headers,
          body: JSON.stringify(body),
        });
        setStatus(result.status);
        setAuthHeader(result.headers.get('authorization'));
        let data = null;
        try {
          data = await result.json();
        } catch (e) {
          data = await result.text();
        }
        setResponse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint, method, JSON.stringify(body)]);

  return (
    <LoginApiCard
      endpoint={endpoint}
      method={method}
      body={body}
      data={response}
      status={status ?? undefined}
      error={error}
      loading={loading}
      authHeader={authHeader}
    />
  );
} 