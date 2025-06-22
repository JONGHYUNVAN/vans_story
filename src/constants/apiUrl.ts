export const API_URLS = {
  AUTH: {
    LOGIN: `/api/auth/login`,
    LOGOUT: `/api/auth/logout`, 
    REFRESH: `/api/auth/refresh`,
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
    SEND: `/api/ai/chat`,
  },
} as const; 