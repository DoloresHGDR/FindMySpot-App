import { Link, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Button } from 'react-native';
import HomeButtons from '@/components/buttons'
import Buttons from '@/components/buttons';
import PatenteModal from '@/components/plateModal';
import { useState } from 'react';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const abrirModal = () => setModalVisible(true);
  const cerrarModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      <Text style={styles.tittle}>Mis Patentes</Text>
      
            <View style={styles.position}>
        <Buttons
          tittle="Añadir patente"
          onPress={() => setModalVisible(true)}
        />
      </View>

      <PatenteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
    color: '#43985b',
    fontWeight: 600,
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