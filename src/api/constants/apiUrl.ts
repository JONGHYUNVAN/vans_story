export const API_URLS = {
  AUTH: {
    LOGIN: `${process.env.AUTH_API_URL}/auth/login`,
    LOGOUT: `${process.env.AUTH_API_URL}/auth/logout`,
    REFRESH: `${process.env.AUTH_API_URL}/auth/refresh`,
  },
  POST: {
    GET: `${process.env.POST_API_URL}/posts`,
    LIST: `${process.env.POST_API_URL}/posts`,
    CREATE: `${process.env.POST_API_URL}/posts`,
  }
} as const; 