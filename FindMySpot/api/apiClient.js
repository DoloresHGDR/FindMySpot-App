import axios from 'axios';
import {getToken, removeToken} from '@/services/storage';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { API_BASE_URL} from '@env';

const apiClient = axios.create({
    baseURL: API_BASE_URL,    
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
            Alert.alert('Sesion vencida','Inicie sesion nuevamente')
            router.replace('/auth/login');
        }

        return Promise.reject(error);
    }
);

export default apiClient