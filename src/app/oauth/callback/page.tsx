'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { oauthSuccess, oauthFailure, oauthFinish } from '@/store/auth/slice';
import { closeLoginModal } from '@/store/modal/slice';
import { showWelcomeAlert } from '@/lib/alerts';
import { oauthUtils } from '@/lib/auth/oauth';
import { authService } from '@/components/features/auth/authService';

/**
 * OAuth 콜백 처리 컴포넌트 (내부)
 * 중간 서버가 `/oauth/callback?code=&state=&provider=`로 되돌려주면
 * ① 로그인 시작 때 보관한 state와 대조하고 ② 임시 코드를 JWT로 교환한 뒤 ③ 홈으로 보낸다.
 */
function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  // 임시 코드는 일회용이라 StrictMode의 effect 2회 실행에서 교환이 두 번 나가면 안 된다.
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const fail = (message: string) => {
      dispatch(oauthFailure(message));
      dispatch(oauthFinish());
      router.push('/');
    };

    const handleOAuthCallback = async () => {
      const callbackData = oauthUtils.extractCallbackDataUnified(
        searchParams,
        window.location.hash,
      );
      const { token, code, error, state } = callbackData;
      const mode =
        searchParams.get('mode') ||
        new URLSearchParams(window.location.hash.substring(1)).get('mode');

      // 로그인을 시작한 탭에만 있는 값. provider는 URL보다 이 값이 더 믿을 만하다.
      const expectedState = oauthUtils.takeState();
      const provider =
        callbackData.provider ??
        (expectedState ? oauthUtils.parseState(expectedState)?.provider : undefined) ??
        'kakao';

      if (error) {
        fail(oauthUtils.getErrorMessage(error, provider));
        return;
      }

      const authCode = code || token;
      if (!authCode) {
        fail('인증 코드를 받지 못했습니다.');
        return;
      }

      // CSRF 방어: 이 탭에서 시작한 로그인의 state와 정확히 같아야 한다.
      if (
        !state ||
        !expectedState ||
        state !== expectedState ||
        !oauthUtils.validateState(state, provider)
      ) {
        fail('잘못된 인증 요청입니다. 다시 로그인해주세요.');
        return;
      }

      if (mode === 'link') {
        // 계정 연결 모드 (아직 미구현)
        fail('계정 연결 기능은 아직 구현되지 않았습니다.');
        return;
      }

      try {
        const { email, name } = await authService.exchangeCodeForToken(authCode);

        dispatch(oauthSuccess({ email, provider }));
        dispatch(closeLoginModal());
        showWelcomeAlert(
          `환영합니다, ${name}님! ${oauthUtils.getProviderDisplayName(provider)} 로그인이 완료되었습니다.`,
        );
        router.push('/');
      } catch (err) {
        console.error('OAuth callback error:', err);
        fail(err instanceof Error ? err.message : 'OAuth 처리 중 오류가 발생했습니다.');
      } finally {
        dispatch(oauthFinish());
      }
    };

    void handleOAuthCallback();
  }, [searchParams, dispatch, router]);

  return <OAuthProcessing />;
}

function OAuthProcessing() {
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
 */
export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<OAuthProcessing />}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
