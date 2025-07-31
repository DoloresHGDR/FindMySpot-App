import { ModalParking } from '@/components/modalParking';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, RefreshControl} from 'react-native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import apiClient from '@/api/apiClient';
import { useUser } from '@/context/UserContext';
import AwesomeAlert from 'react-native-awesome-alerts';
import CountDown from 'react-native-countdown-component';
import { format } from 'date-fns';

type MarkerType = {
  id: number;
  latitude: number;
  longitude: number;
};

interface HistoryDTO {
  id: string,
  startDate: string;
  endDate: string;
  address: string;
  plate: string;
  duration: string;
  price: string;
}

const ParkingScreen: React.FC = () => {

  const [refreshing, setRefreshing] = useState(false);
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
  const [history, setHistory] = useState([]);
  const [lastParking, setLastParking] = useState<HistoryDTO | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [parkingActive, setParkingActive] = useState(false);
  const [selectedParkingData, setSelectedParkingData] = useState<HistoryDTO | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    fetchHistory();
    setRefreshing(false);
  };

  const handleSubmit = async (data: { plate: string; address: string; duration: string }) => {
    try {
      const response = await apiClient.post('/api/parkings/create', {
        userId: user.id,
        plateId: data.plate,
        address: data.address,
        durationMinutes: data.duration,
      });
      const parkingData = response.data;
      const end = new Date(parkingData.endTime);
      const now = new Date();
      const diffInSeconds = Math.floor((end.getTime() - now.getTime()) / 1000);

      if (diffInSeconds > 0) {
        setRemainingSeconds(diffInSeconds);
        setParkingActive(true);
      } else {
        setRemainingSeconds(0);
        setParkingActive(false);
      }
      
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

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get(`/api/parkings/history/user/${user.id}?limit=3`)
      setHistory(response.data)
      if (response.data.length > 0) {
      const latest = response.data[0];
      setLastParking(latest);

      const now = new Date();
      const endTime = new Date(latest.endDate);
      const remaining = Math.floor((endTime.getTime() - now.getTime()) / 1000);

      if (remaining > 0) {
        setRemainingSeconds(remaining);
        setParkingActive(true);
      } else {
        setRemainingSeconds(0);
        setParkingActive(false);
      }
    }
      
    } catch (error) {
      console.error('Error al obtener el historial de estacionamiento', error);
    }
  }

  const formatLastParkingDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM 'a las' HH:mm");
  };

  const handleConfirmRepark = () => {
    setShowAlert(false);
    if (!selectedParkingData) return;

    if (parkingActive) {
      Alert.alert('Error', 'Ya tenés un estacionamiento activo.');
      console.log('Ya tenés un estacionamiento activo.');
      return;
    }

    let numericDuration = selectedParkingData.duration.replace(/\D/g, '');

    if (Number(numericDuration) < 10) {
        numericDuration = "10";
    }

    const matchedPlate = user.plate?.find(
      (plate) => plate.number.trim() === selectedParkingData.plate.trim()
    );

    if (!matchedPlate) {
      Alert.alert('Error', 'No se encontró la patente en el usuario.');
      return;
    }

    handleSubmit({
      plate: String(matchedPlate.id),
      address: selectedParkingData.address,
      duration: numericDuration,
    });
  };

  const handleParkingButtonPress = () => {
    if (parkingActive) {
      if (lastParking) {
        handleStopParking(lastParking.id);
      } else {
        console.log('No se encuentra el ultimo estacionamiento.')
      }
    } else {
      setModalVisible(true);
    }
  };

  const handleStopParking = async (id: string) => {
    try {
        await apiClient.post(`api/parkings/finish/${id}`)
        setRemainingSeconds(0);
        setParkingActive(false);
        Alert.alert('Finalizado', 'Se detuvo el estacionamiento')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserLocation();
    fetchHistory();
  }, [parkingActive]);

  useEffect(() => {
    if (userLocation) {
      fetchParkingLocations();
    }
  }, [userLocation]);



  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled" refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <TouchableOpacity style={[styles.button]} onPress={() => handleParkingButtonPress()}>
        <Text style={styles.buttonText}>{parkingActive ? 'Detener' : 'Estacionarme'}</Text>
      </TouchableOpacity>

      {parkingActive && remainingSeconds !== null && remainingSeconds > 0 && (
        <View
          style={{
            backgroundColor: '#223726',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 12,
            marginVertical: 10,
          }}
        >
          <CountDown
            until={remainingSeconds}
            onFinish={() => {
              setParkingActive(false);
              Alert.alert('Tiempo terminado', 'Tu estacionamiento ha finalizado.');
            }}
            size={22}
            timeToShow={['M', 'S']}
            timeLabels={{ m: '', s: '' }}
            showSeparator
            digitStyle={{
              backgroundColor: 'transparent',
              width: undefined,
            }}
            digitTxtStyle={{
              color: '#43975a',
              fontSize: 28,
              fontWeight: 'bold',
            }}
            separatorStyle={{
              color: '#43975a',
              fontSize: 28,
              fontWeight: 'bold',
            }}
          />
        </View>
      )}

      <ModalParking
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        plates={user.plate?.map((plates) => ({ id: String(plates.id), number: plates.number })) || []}
        onSubmit={handleSubmit}
        googleApiKey={apiKey}
      />

      <View style={styles.mapContainer}>
        <MapView
          provider="google"
          style={styles.map}
          initialRegion={region}
          minZoomLevel={13}
          showsUserLocation={true}
          followsUserLocation={true}
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
      
      <View style={styles.lastParking}>
        {[
          {label: 'Ultimo estacionamiento', value: lastParking? formatLastParkingDate(lastParking.endDate) : 'Cargando...', icon: require('@/assets/images/history-time-clock.png') },
          {label: 'Patente', value: lastParking?.plate, icon: require('@/assets/images/license-plate.png')},
          {label: 'Ubicacion', value: lastParking?.address, icon: require('@/assets/images/ubication.png')},          
        ].map((item, index) => (
          <View key={index} style={styles.infoLastParking}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.label}>
              {item.label}:
              <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}> {item.value}</Text>
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.lastThreeParkingsContainer}>
        <Text style={styles.lastThreeParkingsTitle}> Volver a estacionar aqui</Text>
        {history.map((parking : any, index) => (
          <TouchableOpacity key={index} style={styles.lastThreeParkingsItems} onPress={() => {setSelectedParkingData(parking); setShowAlert(true)}}>
            <Text style={{ color: 'white', flex: 1, marginRight: 10, fontSize: 16 }}>
              {parking.address}
            </Text>
            <Text style={{ color: 'white', flexShrink: 0, marginRight: 6, textAlign: 'right', fontSize: 16 }}>
              {parking.duration}
            </Text> 
            <Image source={require('@/assets/images/repeat.png')} style={{resizeMode: 'contain', width: 28, height: 28}} />
          </TouchableOpacity>
        ))}

        <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Volver a estacionar"
        message="¿Seguro que quieres estacionar aquí? La duracion sera la misma que la ultima vez"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Cancelar"
        confirmText="Sí"
        confirmButtonColor="#43975a"
        cancelButtonColor='#974343ff'
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={() => handleConfirmRepark()}

        overlayStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        }}
        confirmButtonStyle={{
          paddingVertical: 12,
          paddingHorizontal: 40,
          borderRadius: 8,    
          fontSize: 18,   
        }}
        cancelButtonStyle={{
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          fontSize: 18,
        }}

        titleStyle={{
          color: '#e6e6e6',
          fontWeight: 'bold'
        }}

        messageStyle={{
          color: '#e6e6e6',
          textAlign: 'center',
          lineHeight: 20,
          fontSize: 16
        }}

        contentContainerStyle={{
          backgroundColor: '#1a1a19'
          
        }}
      />
      </View>

    </ScrollView>
  );
};

export default ParkingScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#1a1a19'
  },
  button: {
    backgroundColor:'#223726',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 20,
    marginTop: 50,
    width: '50%',
    
  },
  buttonText: {
    color: '#43975a',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: '#252525ff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  mapContainer: {
    width: '95%',
    maxHeight: '40%',
    height: 350,
    borderColor: '#43975a',
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginVertical: 15,
    alignSelf: 'center'
  },
  map: {
    width: '100%',
    height: '100%',
  },
  lastParking: {
    marginTop: 30,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    gap: 20,
    borderRadius: 10,
    borderBottomColor: '#276437ff',
    borderWidth: 1,
    borderBottomWidth: 2,
    padding: 10,
    width: '90%',
    backgroundColor: '#29292642'
  },
  label: {
    color: 'white',
    fontWeight: 'bold'
  },
  icon: {
    resizeMode: 'contain',
    width: 24,
    height: 24,
  },
  infoLastParking: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    maxWidth: '90%'
  },
  lastThreeParkingsContainer: {
    marginTop: 40,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    gap: 10,
    borderRadius: 10,
    borderBottomColor: '#276437ff',
    borderWidth: 1,
    borderBottomWidth: 2,
    padding: 10,
    width: '90%',
    backgroundColor: '#29292642',
    
  },
  lastThreeParkingsItems: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    borderBottomColor: '#27643788',
    borderBottomWidth: 2,
    borderRadius: 20,
    
  },
  lastThreeParkingsTitle: {
    color: '#43975a', 
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 18
  },
  buttonDisabled: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
});
