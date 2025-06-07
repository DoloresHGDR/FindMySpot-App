import { ModalParking } from '@/components/modalParking';
import MyComponent from '@/components/prueba';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const ParkingScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const plates = ['ABC123', 'XYZ789', 'DEF456'];

  const handleSubmit = (data: { plate: string; address: string; duration: string }) => {
    console.log('Datos recibidos del modal:', data);
    Alert.alert('Datos enviados', `Patente: ${data.plate}\nDirección: ${data.address}\nDuración: ${data.duration} min`);
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText} >Estacionarme</Text>
      </TouchableOpacity>
        <ModalParking
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          plates={plates}
          onSubmit={handleSubmit}
          googleApiKey="AIzaSyAc9TkncKPp1e2woZfDIsDQNv-zrAFPqBs"
        />
    </View>
  );
}

export default ParkingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    width: 200,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    top: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5
  }
});