'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { oauthUtils } from '@/lib/auth/oauth';
import type { LinkedOAuthAccount, OAuthProvider } from '@/types/auth';
import { authService } from './authService';

/**
 * OAuth 계정 관리 컴포넌트
 * @description 연결된 OAuth 계정 목록 표시 및 연결/해제 기능 제공
 */
function OAuthAccountManager() {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedOAuthAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * 연결된 OAuth 계정 목록 조회 (응답 도착 후에만 상태 갱신)
   */
  const loadLinkedAccounts = () =>
    authService
      .getLinkedOAuthAccounts()
      .then((response) => {
        if (response.success && response.data?.linkedAccounts) {
          setLinkedAccounts(response.data.linkedAccounts);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch linked accounts:', error);
        setError('연결된 계정을 불러오는데 실패했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });

  /**
   * 연결된 OAuth 계정 목록 새로고침 (로딩/에러 상태 초기화 후 재조회)
   */
  const fetchLinkedAccounts = async () => {
    setLoading(true);
    setError(null);
    await loadLinkedAccounts();
  };

  /**
   * OAuth 계정 연결
   * @param provider OAuth 제공자
   */
  const handleLinkAccount = (provider: OAuthProvider) => {
    try {
      setActionLoading(`link-${provider}`);

      // OAuth 중간 서버로 리다이렉트하여 계정 연결 시작
      const frontendUrl = `${window.location.origin}/oauth/callback?mode=link`;
      const state = oauthUtils.generateState(provider);
      oauthUtils.saveState(state);
      const oauthUrl = oauthUtils.buildOAuthUrl(provider, frontendUrl, state);

      window.location.href = oauthUrl;
    } catch (error) {
      console.error('Failed to start account linking:', error);
      setError(`${oauthUtils.getProviderDisplayName(provider)} 계정 연결에 실패했습니다.`);
      setActionLoading(null);
    }
  };

  /**
   * OAuth 계정 연결 해제
   * @param provider OAuth 제공자
   */
  const handleUnlinkAccount = async (provider: OAuthProvider) => {
    if (!confirm(`${oauthUtils.getProviderDisplayName(provider)} 계정 연결을 해제하시겠습니까?`)) {
      return;
    }

    try {
      setActionLoading(`unlink-${provider}`);
      setError(null);

      const response = await authService.unlinkOAuthAccount(provider);

      if (response.success) {
        // 성공 시 목록 새로고침
        await fetchLinkedAccounts();
        alert(`${oauthUtils.getProviderDisplayName(provider)} 계정 연결이 해제되었습니다.`);
      }
    } catch (error) {
      console.error('Failed to unlink account:', error);
      setError(`${oauthUtils.getProviderDisplayName(provider)} 계정 연결 해제에 실패했습니다.`);
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * 제공자별 아이콘 반환
   */
  const getProviderIcon = (provider: OAuthProvider) => {
    const icons = {
      kakao: '/kakao.webp',
      google: '/google.webp',
    };
    return icons[provider];
  };

  /**
   * 연결 가능한 제공자 목록 (현재 연결되지 않은 것들)
   */
  const availableProviders: OAuthProvider[] = ['kakao', 'google'].filter(
    (provider) => !linkedAccounts.some((account) => account.provider === provider),
  ) as OAuthProvider[];

  // 초기 상태가 이미 loading=true, error=null 이므로 마운트 시에는 조회만 수행
  useEffect(() => {
    loadLinkedAccounts();
  }, []);

  return (
    <div className="electric-border rounded-xl bg-[#191919] p-6">
      <h3 className="neon-text mb-6 text-xl font-bold text-white">소셜 계정 관리</h3>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-900/30 p-3">
          <p className="text-center text-red-300">{error}</p>
        </div>
      )}

      {/* 로딩 상태 */}
      {loading ? (
        <div className="py-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#2ecc71]" />
          <p className="mt-2 text-gray-400">로딩 중...</p>
        </div>
      ) : (
        <>
          {/* 연결된 계정 목록 */}
          <div className="mb-6">
            <h4 className="mb-3 text-lg text-gray-300">연결된 계정</h4>
            {linkedAccounts.length > 0 ? (
              <div className="space-y-3">
                {linkedAccounts.map((account) => (
                  <div
                    key={account.provider}
                    className="flex items-center justify-between rounded-lg border border-gray-600 bg-gray-800/50 p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Image
                        src={getProviderIcon(account.provider)}
                        alt={account.provider}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium text-white">
                          {oauthUtils.getProviderDisplayName(account.provider)}
                        </p>
                        <p className="text-sm text-gray-400">
                          연결일: {new Date(account.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnlinkAccount(account.provider)}
                      disabled={actionLoading === `unlink-${account.provider}`}
                      className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-600/50"
                    >
                      {actionLoading === `unlink-${account.provider}` ? '해제 중...' : '연결 해제'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-gray-400">연결된 계정이 없습니다.</p>
            )}
          </div>

          {/* 연결 가능한 계정 */}
          {availableProviders.length > 0 && (
            <div>
              <h4 className="mb-3 text-lg text-gray-300">계정 연결</h4>
              <div className="space-y-3">
                {availableProviders.map((provider) => (
                  <div
                    key={provider}
                    className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800/30 p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Image
                        src={getProviderIcon(provider)}
                        alt={provider}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <p className="font-medium text-white">
                        {oauthUtils.getProviderDisplayName(provider)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLinkAccount(provider)}
                      disabled={actionLoading === `link-${provider}`}
                      className="rounded-lg bg-[#2ecc71] px-4 py-2 text-white transition-colors hover:bg-[#27ae60] disabled:cursor-not-allowed disabled:bg-[#2ecc71]/50"
                    >
                      {actionLoading === `link-${provider}` ? '연결 중...' : '계정 연결'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OAuthAccountManager;
