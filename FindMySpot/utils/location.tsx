import { GOOGLE_API } from '@/constants/googleApi';
import axios from 'axios';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const getCoordinates = async (address: string, apiKey: string) => {

  const baseUrl = GOOGLE_API.GEOCODE_API_BASE_URL;
  
  const url = `${baseUrl}?address=${encodeURIComponent(address)}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return location;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener coordenadas', error);
    return null;
  }
};

export const isNearby = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000;
  return distance <= 200;
};

export const getUserLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
    return null;
  }
  const location = await Location.getCurrentPositionAsync({});
  return location.coords;
};