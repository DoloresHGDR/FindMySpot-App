import axios from 'axios';
import {getToken, removeToken} from '@/services/storage';
import { useRouter } from 'expo-router';

const apiClient = axios.create({
    baseURL: 'http://192.168.1.40:8080',    
});

apiClient.interceptors.request.use(
    async config => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

const router = useRouter();

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;

        if (status === 401) {
            await removeToken();
            router.replace('/login');
        }

        return Promise.reject(error);
    }
);

export default apiClient