import axios from 'axios';
import {getToken, removeToken, getMemoryToken, clearMemoryToken} from '@/services/storage';
import { useRouter } from 'expo-router';

const apiClient = axios.create({
    baseURL: 'http://192.168.1.40:8080',    
});

apiClient.interceptors.request.use(
    async config => {
        const token = await getToken();
        let tokenMemory = getMemoryToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            config.headers.Authorization = `Bearer ${tokenMemory}`;
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
        if (status === 401 || status === 403) {
            await removeToken();
            clearMemoryToken();
            router.replace('/');
        }
        return Promise.reject(error);
    }
);

export default apiClient