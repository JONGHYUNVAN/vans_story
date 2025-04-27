import { useState, useEffect } from 'react';
import { PostApiCard } from '../../post.api.card';

interface Props {
  endpoint: string;
  method?: 'GET';
  body?: any;
}

export default function PostApiLive({ endpoint, method = 'GET', body }: Props) {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (method !== 'GET') return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetch(endpoint, {
          method,
        });
        setStatus(result.status);
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
  }, [endpoint, method]);

  return (
    <PostApiCard
      endpoint={endpoint}
      method={method}
      body={body}
      data={response}
      status={status}
      error={error}
      loading={loading}
    />
  );
} 