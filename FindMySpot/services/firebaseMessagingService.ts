import apiClient from '@/api/apiClient';
import { 
  getMessaging, 
  getToken, 
  onMessage, 
  onTokenRefresh 
} from '@react-native-firebase/messaging';
import { PermissionsAndroid ,Platform } from 'react-native';

const messaging = getMessaging();
const platformName = Platform.OS;

async function getFcmToken(): Promise<string | undefined> {
  try {
    const token = await getToken(messaging);
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token', error);
    return undefined;
  }
}

function listenTokenRefresh(callback: (token: string) => void) {
  return onTokenRefresh(messaging, callback);
}

function listenForegroundMessages(callback: (message: any) => void) {
  return onMessage(messaging, callback);
}

async function saveFcmToken(token: string) {
  try {
    await apiClient.post('/api/notifications/save-fcm-token', { token, platform: platformName });
    console.log('Token saved successfully');
  } catch (error) {
    console.log('Error saving FCM token:', error);
  }
}

async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Permiso para notificaciones',
        message: 'Esta app necesita permiso para mostrar notificaciones.',
        buttonPositive: 'Aceptar',
        buttonNegative: 'Cancelar',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
    return true;
}

export async function setupFirebaseMessaging() {
  
  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) {
    console.warn('Permiso de notificación no otorgado');
    return;
  }

  const fcmToken = await getFcmToken();
  if (fcmToken) {
    await saveFcmToken(fcmToken);
  }

  const unsubscribeTokenRefresh = listenTokenRefresh(async (newToken) => {
    await saveFcmToken(newToken);
  });

  const unsubscribeOnMessage = listenForegroundMessages(message => {
    console.log('Foreground FCM message:', message);
  });

  return () => {
    unsubscribeTokenRefresh();
    unsubscribeOnMessage();
  };
}