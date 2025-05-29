import axios from 'axios';
import {getToken} from '@/services/storage';

const apiClient = axios.create({
    baseURL: 'http://192.168.18.2:8080',
});

apiClient.interceptors.request.use(
    async config => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    error => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        if (status === 401) {
            await deleteToken();
            router.replace('/');
        }
        return Promise.reject(error);
    }
);

export default apiClient