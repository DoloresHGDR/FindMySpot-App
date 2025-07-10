import { ModalParking } from '@/components/modalParking';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import apiClient from '@/api/apiClient';
import { useUser } from '@/context/UserContext';

type MarkerType = {
  id: number;
  latitude: number;
  longitude: number;
};

const ParkingScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [region, setRegion] = useState({
    latitude: -34.616158,
    longitude: -68.329941,
    latitudeDelta: 0.005,
    longitudeDelta: 0.02,
  });
  const [userLocation, setUserLocation] = useState<any>(null);
  const apiKey = "AIzaSyAc9TkncKPp1e2woZfDIsDQNv-zrAFPqBs";
  const customMarkerIcon = require('@/assets/images/car-parking.png');
  const { user } = useUser();


  const handleSubmit = async (data: { plate: string; address: string; duration: string }) => {
    try {
      const response = await apiClient.post('/api/parkings/create', {
        userId: user.id,
        plateId: data.plate,
        address: data.address,
        durationMinutes: data.duration,
      });

      console.log('Datos recibidos del modal:', data);
      Alert.alert('Datos enviados', `Patente: ${data.plate}\nDirección: ${data.address}\nDuración: ${data.duration} min`);
    } catch (error) {
      console.error('Error al registrar el estacionamiento', error)
      return null;
    }
    
    
  };

  const getCoordinates = async (address: any) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;
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

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
  };

  const isNearby = (lat1: number, lon1: number, lat2: number, lon2: number) => {
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

  const fetchParkingLocations = async () => {
    try {
      const response = await apiClient.get('/api/parkings/about-to-finish/map')
      const parkings = response.data

      const locations: MarkerType[] = [];
      for (const parking of parkings) {
        const fullAddress = `${parking.address}, San Rafael, Mendoza`;
        const coords = await getCoordinates(fullAddress);
        if (coords) {
          const { lat, lng } = coords;
          if (userLocation) {
            const nearby = isNearby(userLocation.latitude, userLocation.longitude, lat, lng);
            if (nearby) {
              locations.push({ id: parking.id, latitude: lat, longitude: lng });
            }
          } else {
            locations.push({ id: parking.id, latitude: lat, longitude: lng });
          }
        }
      }

      if (!userLocation) {
        locations.splice(20);
      }
      
      setMarkers(locations);
    } catch (error) {
      console.error('Error al obtener los estacionamientos:', error);
    }
  };


  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchParkingLocations();
    }
  }, [userLocation]);

  const mapHeight = Dimensions.get('window').height * 0.5;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Estacionarme</Text>
      </TouchableOpacity>
      <ModalParking
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        plates={user.plate.map((plates) => ({ id: String(plates.id), number: plates.number }))}
        onSubmit={handleSubmit}
        googleApiKey={apiKey}
      />

      <View style={[styles.mapContainer, { maxHeight: mapHeight }]}>
        <MapView
          provider="google"
          style={styles.map}
          initialRegion={region}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={`Estacionamiento ${marker.id}`}
              description={`Ubicación del estacionamiento ${marker.id}`}
              image={customMarkerIcon}
            />
          ))}
        </MapView>
      </View>
    </View>
  );
};

export default ParkingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    width: 200,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    top: 40,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    marginTop: 'auto',
    borderColor: '#000',
    borderRadius: 10,
    borderWidth: 2,
    overflow: 'hidden',
    bottom: 40,
  },
  map: {
    flex: 1,
  },
});
