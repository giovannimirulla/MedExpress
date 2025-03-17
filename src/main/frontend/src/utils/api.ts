import { AuthEntityType } from '@/enums/AuthEntityType';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    withCredentials: true, // Necessario per il refresh token
});

function logout() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('role');
    Cookies.remove('id');
    Cookies.remove('name');
    Cookies.remove('entityType');
    window.location.href = '/login';
}

// Interceptor per aggiungere automaticamente il token
api.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get('accessToken');
        const excludedPaths = ['/auth', '/aifa'];

        if (accessToken && !excludedPaths.some(path => config.url?.startsWith(path))) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor per gestire l'errore di token scaduto
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const entityType = Cookies.get('entityType');
            const refreshToken = Cookies.get('refreshToken');

            if (!entityType || !refreshToken) {
                logout();
                return Promise.reject(error);
            }

            try {
                let response;
                if (entityType === AuthEntityType.User) {
                    // Chiama l'endpoint per il refresh del token per l'utente
                    response = await api.post('/auth/refresh/user', {
                        refreshToken,
                        entityType,
                    });
                } else if (entityType === AuthEntityType.Pharmacy) {
                    // Chiama l'endpoint per il refresh del token per la farmacia
                    response = await api.post('/auth/refresh/pharmacy', {
                        refreshToken,
                        entityType,
                    });
                }
                
                console.log(response);
                if (response && response.data) {
                    const accessToken = response.data.accessToken;
                    // Aggiorna i cookie e l'header per la richiesta originale
                    Cookies.set('accessToken', accessToken);
                    Cookies.set('refreshToken', response.data.refreshToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } else {
                    logout();
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;