import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';

interface ApiDemoProps {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

const ApiDemo = ({ endpoint, method }: ApiDemoProps) => {
  const [response, setResponse] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetch(endpoint, { method });
        const data = await result.json();
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
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-bold mb-4">API 호출 데모</h3>
      <div className="mb-2">
        <strong>엔드포인트:</strong> {endpoint}
      </div>
      <div className="mb-2">
        <strong>메소드:</strong> {method}
      </div>
      <div className="mb-4">
        <strong>상태:</strong>{' '}
        {loading ? '로딩 중...' : error ? `에러: ${error}` : '완료'}
      </div>
      {response && (
        <div>
          <strong>응답:</strong>
          <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// API 데모 컴포넌트 래퍼
const ApiDemoWrapper = () => {
  return (
    <Provider store={store}>
      <div className="w-full max-w-2xl mx-auto">
        <ApiDemo 
          endpoint="https://jsonplaceholder.typicode.com/todos/1"
          method="GET"
        />
      </div>
    </Provider>
  );
};

const meta: Meta = {
  title: 'stories/features/API',
  component: ApiDemoWrapper,
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8f8f8' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', background: '#f8f8f8', minHeight: '500px', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ApiDemoWrapper>;

export const Default: Story = {};

export const PostRequest: Story = {
  render: () => (
    <Provider store={store}>
      <div className="w-full max-w-2xl mx-auto">
        <ApiDemo 
          endpoint="https://jsonplaceholder.typicode.com/posts"
          method="POST"
        />
      </div>
    </Provider>
  ),
}; 