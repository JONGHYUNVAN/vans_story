export const API_URLS = {
  AUTH: {
    LOGIN: `${process.env.AUTH_API_URL}/auth/login`,
    LOGOUT: `${process.env.AUTH_API_URL}/auth/logout`,
    REFRESH: `${process.env.AUTH_API_URL}/auth/refresh`,
  },
  POST: {
    GET: `${process.env.POST_API_URL}/posts`,
    GET_STORY: `${process.env.NEXT_PUBLIC_POST_API_URL}/posts`,
    LIST: `${process.env.POST_API_URL}/posts`,
    CREATE: `${process.env.NEXT_PUBLIC_POST_API_URL}/posts`,
    UPDATE: `${process.env.NEXT_PUBLIC_POST_API_URL}/posts`,
    UPLOAD_IMAGE: `/api/upload/image`,
  }
} as const; 