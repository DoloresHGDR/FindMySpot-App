import { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import AwesomeAlert from 'react-native-awesome-alerts';
import Buttons from '@/components/buttons';
import PatenteModal from '@/components/plateModal';
import { useUser } from '@/context/UserContext';
import { AxiosError } from 'axios';
import apiClient from '@/api/apiClient';

export default function myPlatesScreen() {
  const [showAlert, setShowAlert] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fontsLoaded] = useFonts({'FE-Font': require('@/assets/fonts/FE-FONT.ttf')});
  const [plates, setPlates] = useState([]);
  const { user } = useUser();

  const abrirModal = () => setModalVisible(true);
  const cerrarModal = () => setModalVisible(false);

  const fetchPlates = async () => {
    try {
      const response = await apiClient.get(`/api/plates/user/${user.id}`);
      const plateNumbers = response.data;
      setPlates(plateNumbers);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        Alert.alert('Error', (err.response.data as string) || "Error al obtener plates");
      } else {
        Alert.alert('Error', "No se pudo conectar con el servidor.");
      }
    }
  };

  const handleDelete = async (plate: any) => {
    console.log(plates)
    setShowAlert(false);
    try {
      await apiClient.delete(`/api/plates/${plate}`);
      setPlates(prev => prev.filter(p => p !== plate));
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar la patente.");
    }
  };

  useEffect(() => {
    fetchPlates();
  }, [plates]);

  const isNewFormat = (plate: any) => {
    return /^[A-Z]{2}\s?[0-9]{3}\s?[A-Z]{2}$/.test(plate); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tittle}>Mis Patentes</Text>

      {plates.length > 0 ? (
        <View style={styles.platesContainer}>
          {plates.map((plate, index) => {
            const imageSource = isNewFormat(plate.number)
              ? require('@/assets/images/plate_new.png') 
              : require('@/assets/images/plate_old.png');

            return (
              <View key={index} style={styles.plateWrapper}>
                <ImageBackground
                  source={imageSource}
                  resizeMode="stretch"
                  style={styles.plateImage}
                >
                  <Text
                    style={[
                      styles.plateNumber,
                      isNewFormat(plate.number) ? styles.newPlateText : styles.oldPlateText
                    ]}
                  >
                    {plate.number}
                  </Text>
                </ImageBackground>
                <Text style={styles.deleteButton} onPress={() => setShowAlert(true)}>
                  ❌
                </Text>

                  <AwesomeAlert
                    show={showAlert}
                    showProgress={false}
                    title="Eliminar matricula"
                    message="¿Seguro que quieres eliminar esta matricula?"
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="Cancelar"
                    confirmText="Sí"
                    confirmButtonColor="#43975a"
                    cancelButtonColor='#974343ff'
                    onCancelPressed={() => setShowAlert(false)}
                    onConfirmPressed={() => handleDelete(plate.id)}

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
            );
          })}
        </View>
      ) : (
        <Text style={{ color: '#999', marginTop: 20 }}>Añade tu Matricula</Text>
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
    fontWeight: '900',
  },

  platesContainer: {
    marginTop: 20,
    flexDirection: 'column',
    gap: 25,
  },

  plateWrapper: {
    position: 'relative',
    width: 280,
    height: 90,
    alignSelf: 'center',
  },

  plateImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100
  },

  plateNumber: {
    fontFamily: 'FE-Font', 
    fontSize: 45,
    paddingTop: 30
  },

  oldPlateText: {
    color: '#fff', 
    fontSize: 50,
    paddingTop: 15
  },

  newPlateText: {
    color: '#000', 
    fontSize: 47
  },

  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    fontSize: 22,
    color: 'red',
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
