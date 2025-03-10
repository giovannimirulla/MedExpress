import { AuthEntityType } from '@/enums/AuthEntityType';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    withCredentials: true, // Necessario per il refresh token
});

// Interceptor per aggiungere automaticamente il token
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
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
            try {
                let response;
                if(localStorage.getItem('entityType')== AuthEntityType.User){
                // Chiama l'endpoint per il refresh del token
                response = await api.post('/auth/refresh/user', {
                    refreshToken: localStorage.getItem('refreshToken'),
                    entityType: localStorage.getItem('entityType'),
                });
            } else if (localStorage.getItem('entityType') == AuthEntityType.Pharmacy){
                // Chiama l'endpoint per il refresh del token
                response = await api.post('/auth/refresh/pharmacy', {
                    refreshToken: localStorage.getItem('refreshToken'),
                    entityType: localStorage.getItem('entityType'),
                });
            }
                let accessToken;
                console.log(response);
                if (response && response.data) {
                    accessToken = response.data.accessToken;
                // Aggiorna il localStorage e l'header per la richiesta originale
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                }
                //if response is 401, logout
                else{
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('role');
                    localStorage.removeItem('id');
                    localStorage.removeItem('name');
                    localStorage.removeItem('entityType');
                    return Promise.reject(error);
                }
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Se il refresh del token fallisce, effettua il logout
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('role');
                localStorage.removeItem('id');
                localStorage.removeItem('name');
                localStorage.removeItem('entityType');
                return Promise.reject(refreshError);
             
            }
        }
        return Promise.reject(error);
    }
);

export default api;