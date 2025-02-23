export const API_URLS = {
  AUTH: {
    LOGIN: `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/login`,
    LOGOUT: `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/logout`,
    REFRESH: `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/refresh`,
  },
  POST: {
    GET: `${process.env.NEXT_PUBLIC_POST_API_URL}`,
  }
} as const; 