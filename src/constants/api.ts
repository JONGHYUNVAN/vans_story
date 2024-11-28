export const API_ROUTES = {
  AUTH: {
    LOGIN: `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    LOGOUT: `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
    REFRESH: `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
  }
} as const; 