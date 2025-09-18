import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getToken, removeToken } from '@/services/storage';
import { decodeJwtToken, isTokenExpired } from '@/utils/tokenUtils';
import { useUser } from '@/context/UserContext';
import apiClient from '@/api/apiClient';


export default function Splash() {
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token && !isTokenExpired(token)) {
        const decoded = decodeJwtToken(token);

        if (decoded?.sub) {
          try {
            const response = await apiClient.get(`/api/users/identity/${decoded.sub}`);
            const user = response.data;

            setUser({
              logged: true,
              id: user.id,
              name: user.name,
              surname: user.surname,
              identityNumber: user.identityNumber,
              role: user.role,
              plate: user.plates
            });

            router.replace('/screens/home');
          } catch (error) {
            Alert.alert('Error', 'No se pudo obtener el usuario');
            await removeToken();
            router.replace('/auth/login');
          }
        } else {
          await removeToken();
          router.replace('/auth/login');
        }
      } else {
        router.replace('/auth/login');
      }
    };

    checkAuth();

  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Verificando sesión...</Text>
    </View>
  );
}