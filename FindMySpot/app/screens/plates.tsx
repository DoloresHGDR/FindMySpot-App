import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Buttons from '@/components/buttons';
import PatenteModal from '@/components/plateModal';
import { useUser } from '@/context/UserContext';
import { AxiosError } from 'axios';
import apiClient from '@/api/apiClient';

export default function myPlatesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [plates, setPlates] = useState<string[]>([]);
  const { user } = useUser();

  const abrirModal = () => setModalVisible(true);
  const cerrarModal = () => setModalVisible(false);

  const fetchPlates = async () => {
    try {
      const response = await apiClient.get(`/api/plates/user/${user.id}`);
      const plateNumbers = response.data.map((plate: any) => plate.number);
      setPlates(plateNumbers);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        Alert.alert('Error', err.response.data as string || "Error al obtener plates");
      } else {
        Alert.alert('Error', "No se pudo conectar con el servidor.");
      }
    }
  };

  useEffect(() => {
    fetchPlates();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.tittle}>Mis Patentes</Text>

      {/* Lista de placas */}
      {plates.length > 0 ? (
        <View style={{ marginTop: 20 }}>
          {plates.map((plate, index) => (
            <Text
              key={index}
              style={{ color: '#ebebeb', fontSize: 18, marginBottom: 5 }}
            >
              • {plate}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={{ color: '#999', marginTop: 20 }}>Añadi tu plate wachin</Text>
      )}

      <View style={styles.position}>
        <Buttons
          tittle="Añadir patente"
          onPress={abrirModal}
        />
      </View>

      <PatenteModal
        visible={modalVisible}
        onClose={cerrarModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#1a1a19',
  },

  tittle: {
    fontFamily: 'arial',
    fontSize: 25,
    marginTop: 35, 
    color: '#43985b',
    fontWeight: 900,
  },
  
  position: {
    alignItems: 'center',
    position: 'static',
    display: 'flex',
    flexDirection: 'column',
    height: 100,
    marginTop: 'auto'
  }
});