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
    CALLBACK_PAGE: '/oauth/callback',
    BACKEND_LOGIN: '/api/v1/oauth/login',
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
  CATEGORY: {
    LIST: `/api/categories`,
    GROUPED: `/api/categories/grouped`,
    BY_ID: `/api/categories`,
    BY_VALUE: `/api/categories/value`,
  },
  STOCKS: {
    PRICES: `/api/stocks/prices`,
    MACRO: `/api/stocks/macro`,
    NEWS: `/api/stocks/news`,
    DART: `/api/stocks/dart`,
  },
} as const; 