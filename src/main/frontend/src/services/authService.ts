import api from '@/utils/api';

export const loginUser = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login/user', { email, password });
      return {
        accessToken: response.data.accessToken, // Ritorna l'accessToken
        refreshToken: response.data.refreshToken // Ritorna il refreshToken
      };
    } catch (error) {
      console.error('Errore di login', error);
      return null;
    }
  };

  export const loginPharmacy = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login/pharmacy', { email, password });
        return {
            accessToken: response.data.accessToken, // Ritorna l'accessToken
            refreshToken: response.data.refreshToken // Ritorna il refreshToken
        };
        }
    catch (error) {
        console.error('Errore di login', error);
        return null;
    }
};

  export const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken
      };
    } catch (error) {
      console.error('Errore nel refresh token', error);
      return null;
    }
  };