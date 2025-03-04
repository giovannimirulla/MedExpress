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
                // Chiama l'endpoint per il refresh del token
                const response = await axios.get('http://localhost:8080/api/v1/auth/refresh', {
                    withCredentials: true,
                });
                const { accessToken } = response.data;
                // Aggiorna il localStorage e l'header per la richiesta originale
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Eventuale logout o gestione dell'errore
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;