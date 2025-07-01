export const API_URLS = {
  AUTH: {
    LOGIN: `/api/auth/login`,
    LOGOUT: `/api/auth/logout`, 
    REFRESH: `/api/auth/refresh`,
    SIGNUP: `/api/auth/signup`,
    CALLBACK: `/api/auth/callback`,  // 프론트엔드 OAuth 콜백 API
  },
  OAUTH: {
    SERVER_URL: process.env.NEXT_PUBLIC_OAUTH_SERVER_URL,
    KAKAO_LOGIN: '/api/auth/kakao/login',
    GOOGLE_LOGIN: '/api/auth/google/login',
    VERIFY: '/api/auth/verify',
    REFRESH: '/api/auth/refresh',
    CALLBACK_PAGE: '/oauth/callback',
    BACKEND_LOGIN: '/api/v1/oauth/login',
    BACKEND_EXCHANGE: '/api/v1/oauth/exchange',  // 임시 코드를 JWT 토큰으로 교환
    BACKEND_LINK: '/api/v1/oauth/link',
    BACKEND_UNLINK: '/api/v1/oauth/unlink',
    BACKEND_LINKED: '/api/v1/oauth/linked'
  },
  POST: {
    GET: `/api/posts`,
    GET_STORY: `/api/posts`,
    LIST: `/api/posts`,
    CREATE: `/api/posts`,
    UPDATE: `/api/posts`,
    UPLOAD_IMAGE: `/api/imageUpload`,
  },
  AI: {
    SEND: `/api/ai`,
  },
} as const; 