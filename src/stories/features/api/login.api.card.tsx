"use client";

interface LoginApiCardProps {
  endpoint?: string;
  method?: string;
  body?: any;
  data: any;
  status?: number;
  error?: string | null;
  loading?: boolean;
  authHeader?: string | null;
}

export function LoginApiCard({ endpoint, method, body, data, status, error, loading, authHeader }: LoginApiCardProps) {
  return (
    <div className="p-6 border rounded-2xl bg-white shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-extrabold mb-2 text-gray-800">Login API Test</h2>
      <hr className="mb-6 border-gray-200" />
      <div className="flex flex-col md:flex-row gap-6">
        {/* Request */}
        <div className="flex-1 bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">Request</span>
          </div>
          <div className="mb-2 text-xs text-gray-700">
            <div><span className="font-bold">Endpoint:</span> <span>{endpoint ?? '-'}</span></div>
            <div><span className="font-bold">Method:</span> <span>{method ?? '-'}</span></div>
            <div><span className="font-bold">Body:</span></div>
            <pre className="bg-gray-100 text-gray-800 font-mono text-xs rounded-lg p-2 mt-1 overflow-auto whitespace-pre-wrap">
              {body ? JSON.stringify(body, null, 2) : '-'}
            </pre>
          </div>
        </div>
        {/* Response */}
        <div className="flex-1 bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100">
 
          <div className="mt-3 mb-1 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">Status</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${status === 200 ? 'bg-green-100' : 'bg-red-100'}`}
              style={{ color: status === 200 ? '#15803d' : '#dc2626' }}>
              {status ?? '-'}
            </span>
          </div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">Token</span>
            {authHeader ? (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100" style={{ color: '#15803d' }}>
                Token OK
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100" style={{ color: '#dc2626' }}>
                No Token
              </span>
            )}
          </div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">Response</span>
          </div>
          <pre className="bg-gray-100 text-gray-800 font-mono text-xs rounded-lg p-3 mt-1 overflow-auto whitespace-pre-wrap">
            {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
          </pre>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">State</span>
            {loading ? (
              <div className="ml-2 text-xs font-bold" style={{ color: '#1d4ed8' }}>Loading...</div>
            ) : error ? (
              <div className="ml-2 text-xs font-bold" style={{ color: '#dc2626' }}>Error: {error}</div>
            ) : (
              <div className="ml-2 text-xs font-bold" style={{ color: '#15803d' }}>Done</div>
            )}
          </div>
          {error && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-xs font-mono">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
