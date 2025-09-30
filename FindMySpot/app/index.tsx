import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getToken, removeToken } from '@/services/storage';
import { decodeJwtToken, isTokenExpired } from '@/utils/tokenUtils';
import { useUser } from '@/hooks/useUserQuery';
import apiClient from '@/api/apiClient';
import { useAuthCheck } from '@/hooks/useAuthCheck';


export default function Splash() {
  const router = useRouter();
  const { mutate, isPending } = useAuthCheck();

  useEffect(() => {
    mutate(undefined, {
      onSuccess: () => {
        router.replace('/screens/home');
      },
      onError: (error) => {
        console.error('Auth check failed:', error),
        router.replace('/auth/login');
      }
    });
  }, [mutate, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Verificando sesión...</Text>
    </View>
  );
}