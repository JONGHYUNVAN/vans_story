'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { oauthSuccess, oauthFailure, oauthFinish } from '@/store/auth/slice';
import { closeLoginModal } from '@/store/modal/slice';
import { showWelcomeAlert } from '@/lib/alerts';
import { oauthUtils } from '@/lib/auth/oauth';
import { tokenStorage } from '@/lib/auth/token';

/**
 * OAuth 콜백 처리 컴포넌트 (내부)
 */
function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // URL 파라미터와 Fragment에서 OAuth 콜백 데이터 추출 (둘 다 지원)
        const callbackData = oauthUtils.extractCallbackDataUnified(
          searchParams,
          window.location.hash,
        );
        const { token, code, error, provider = 'kakao' } = callbackData;
        const mode =
          searchParams.get('mode') ||
          new URLSearchParams(window.location.hash.substring(1)).get('mode'); // 'login' 또는 'link'

        if (error) {
          // OAuth 에러 처리 (사용자 친화적 메시지)
          const errorMessage = oauthUtils.getErrorMessage(error, provider);
          dispatch(oauthFailure(errorMessage));
          dispatch(oauthFinish());
          router.push('/');
          return;
        }

        // 임시 코드나 토큰 중 하나는 있어야 함
        const authCode = code || token;
        if (!authCode) {
          dispatch(oauthFailure('인증 코드를 받지 못했습니다.'));
          dispatch(oauthFinish());
          router.push('/');
          return;
        }

        if (mode === 'link') {
          // 계정 연결 모드 (아직 미구현 - 추후 개발 예정)
          dispatch(oauthFailure('계정 연결 기능은 아직 구현되지 않았습니다.'));
          router.push('/');
        } else {
          // 기본 로그인 모드 - 임시 코드를 JWT 토큰으로 교환
          const response = await fetch('/api/auth/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: authCode }),
            credentials: 'include', // 쿠키 포함
          });

          if (!response.ok) {
            throw new Error(`Token exchange failed: ${response.status}`);
          }

          const data = await response.json();

          if (!data.success || !data.token) {
            throw new Error(data.error || 'No JWT token received');
          }

          // JWT 토큰 저장
          tokenStorage.setToken(data.token);

          // 토큰에서 사용자 정보 추출
          let userEmail = 'user@example.com';
          let userName = 'User';

          try {
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            userEmail = payload.email || payload.sub || 'user@example.com';
            userName = payload.name || userEmail.split('@')[0];
          } catch (decodeError) {
            console.warn('Failed to decode JWT token:', decodeError);
          }

          // 로그인 성공 처리
          dispatch(
            oauthSuccess({
              email: userEmail,
              provider: provider,
            }),
          );

          // 환영 메시지 표시
          const providerName = oauthUtils.getProviderDisplayName(provider);
          const welcomeMessage = `환영합니다, ${userName}님! ${providerName} 로그인이 완료되었습니다.`;
          showWelcomeAlert(welcomeMessage);

          // 로그인 모달 닫기
          dispatch(closeLoginModal());

          // 메인 페이지로 리다이렉트
          router.push('/');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'OAuth 처리 중 오류가 발생했습니다.';

        dispatch(oauthFailure(errorMessage));
        router.push('/');
      } finally {
        dispatch(oauthFinish());
      }
    };

    handleOAuthCallback();
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#191919]">
      <div className="text-center">
        <div className="electric-border rounded-xl p-8">
          <div className="rounded-xl bg-[#191919] p-6 opacity-90">
            <h1 className="neon-text mb-4 text-2xl text-white">OAuth 로그인 처리 중...</h1>
            <div className="flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2ecc71]" />
            </div>
            <p className="mt-4 text-gray-300">잠시만 기다려주세요...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * OAuth 콜백 처리 페이지
 * @description OAuth 중간 서버에서 리다이렉트된 토큰을 처리하고 로그인을 완료
 */
export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#191919]">
          <div className="text-center">
            <div className="electric-border rounded-xl p-8">
              <div className="rounded-xl bg-[#191919] p-6 opacity-90">
                <h1 className="neon-text mb-4 text-2xl text-white">OAuth 로그인 처리 중...</h1>
                <div className="flex justify-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2ecc71]" />
                </div>
                <p className="mt-4 text-gray-300">잠시만 기다려주세요...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
