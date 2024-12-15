export const decodeToken = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        email: payload.sub,
        role: payload.auth,
      };
    } catch (error) {
      return null;
    }
  };