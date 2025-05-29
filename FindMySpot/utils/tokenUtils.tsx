import { jwtDecode } from 'jwt-decode';
import { Alert } from 'react-native';

interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

export function decodeJwtToken(token: string): JwtPayload | null {
  if (!token) {
    Alert.alert('Error', 'No se recibió ningún token');
    return null;
  }

  const cleanToken = token.trim();
  const parts = cleanToken.split('.');
  if (parts.length !== 3) {
    Alert.alert('Error', 'El token no tiene estructura JWT válida');
    return null;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(cleanToken);
    return decoded;
  } catch (error: any) {
    Alert.alert('Error al decodificar token', error.message || 'Error desconocido');
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJwtToken(token);
  if (!decoded) return true;

  if (!decoded.exp) {
    Alert.alert('Error', 'El token no tiene campo de expiración');
    return true;
  }

  const now = Date.now() / 1000;
  return decoded.exp < now;
}
