import { ModalParking } from '@/components/modalParking';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, RefreshControl, Button} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useUser } from '@/hooks/useUserQuery';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useParkingLogic } from '@/hooks/useParkingLogic';
import { formatDate } from '@/utils/format';
import ParkingTimer from '@/components/parkingTimer';
import { useParkingMap } from '@/hooks/useParkingMap';
import { useParkingHistory } from '@/hooks/useParkingHistory';

const ParkingScreen: React.FC = () => {
  const apiKey= 'AIzaSyAc9TkncKPp1e2woZfDIsDQNv-zrAFPqBs'
  const { user } = useUser();
  const {
    refreshing,
    modalVisible,
    lastParking,
    showAlert,
    parkingActive,
    setSelectedParkingData,
    setShowAlert,
    setModalVisible,
    handleConfirmRepark,
    handleParkingButtonPress,
    handleSubmit,
    onRefresh,
    setParkingActive,
    handleFinishPark
  } = useParkingLogic({
    userId: user?.id || null,
    userPlates: user?.plate
  });

  const { markers, region } = useParkingMap(apiKey);
  const { history } = useParkingHistory();

  

  const customMarkerIcon = require('@/assets/images/car-parking.png');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }} keyboardShouldPersistTaps="handled" refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <TouchableOpacity style={[styles.button]} onPress={() => handleParkingButtonPress()}>
        <Text style={styles.buttonText}>{parkingActive ? 'Detener' : 'Estacionarme'}</Text>
      </TouchableOpacity>

      {parkingActive && (
        <View>
          <ParkingTimer onFinish={() => handleFinishPark()}/>
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
              image={customMarkerIcon}
            />
          ))}
        </MapView>
      </View>
      
      <View style={styles.lastParking}>
        {[
          {label: 'Ultimo estacionamiento', value: lastParking? formatDate(lastParking.endDate) : 'Cargando...', icon: require('@/assets/images/history-time-clock.png') },
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
          confirmText="Aceptar"
          confirmButtonColor="#43975a"
          cancelButtonColor='#974343ff'
          onCancelPressed={() => setShowAlert(false)}
          onConfirmPressed={() => handleConfirmRepark()}

          overlayStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
          confirmButtonStyle={{
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 8,    
            fontSize: 18,
            right: 120   
          }}
          cancelButtonStyle={{
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 8,
            fontSize: 18,
            left: 120
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
