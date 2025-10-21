import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthCheck } from '@/services/remote/queries/auth/useAuthCheck';


export default function Splash() {
  const router = useRouter();
  const { mutate } = useAuthCheck();

  useEffect(() => {
    mutate(undefined, {
      onSuccess: () => {
        router.replace('/screens/home');
      },
      onError: (error) => {
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