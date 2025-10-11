import { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, Dimensions,} from 'react-native';
import { useFonts } from 'expo-font';
import AwesomeAlert from 'react-native-awesome-alerts';
import PatenteModal from '@/components/plateModal';
import { useUser } from '@/services/remote/queries/user/useUserQuery';
import apiClient from "@/services/remote/apiClient";
import { MaterialIcons } from '@expo/vector-icons';
import FlipCard from '@/components/flipCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { User } from '@/models/user';

const { width } = Dimensions.get('window');

export default function PlatesScreen() {
  const [showAlert, setShowAlert] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlateToDelete, setSelectedPlateToDelete] = useState<any>(null);
  const [fontsLoaded] = useFonts({'FE-Font': require('@/assets/fonts/FE-FONT.ttf')});
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [activeIndex, setActiveIndex] = useState(0);

  const deletePlateMutation = useMutation({
    mutationFn: (plateId: number) => {
      return apiClient.delete(`/api/plates/${plateId}`);
    },
    onMutate: async (plateIdToDelete) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.USER]});
      const previousUser = queryClient.getQueryData<User>([QUERY_KEYS.USER]);

      const updatedPlates = previousUser?.plate.filter(
        plateUser => plateUser.id !== plateIdToDelete
      ) || [];

      const updatedUser: User = {
        ...previousUser!,
        plate: updatedPlates
      };

      queryClient.setQueryData([QUERY_KEYS.USER], updatedUser);

      return {previousUser}
    },
    onError: (err, plateIdToDelete, context) => {
        Alert.alert("Error", "No se pudo eliminar la matrícula.");
        if (context?.previousUser) {
            queryClient.setQueryData<User>([QUERY_KEYS.USER], context.previousUser);
        }
    },
    onSuccess: () => {
      Alert.alert("Exito", "Matriculada eliminada correctamente")
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER]});
    }
  })

  const handleDelete = async (plate: any) => {
    setShowAlert(false);
    
    const plateToDeleteId = plate ? plate.id : (selectedPlateToDelete ? selectedPlateToDelete.id : null);

    if (!plateToDeleteId) return;

    deletePlateMutation.mutate(plateToDeleteId);
    setSelectedPlateToDelete(null);
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando fuentes...</Text>
      </View>
    );
  }

  const renderPlateItem = ({ item: plate }: any) => {
    return (
      <View style={styles.plateCardContainer}>
          <FlipCard plate={plate}/>
      </View>
    );
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const itemWidth = width * 0.8 + width * 0.05 * 2;
    const currentIndex = Math.round(scrollPosition / itemWidth);
    setActiveIndex(currentIndex);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Matrículas</Text>
      

      {user?.plate.length > 0 ? (
        <>
          <FlatList
            data={user.plate}
            renderItem={renderPlateItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.platesCarouselContainer}
          />
          <View style={styles.pagination}>
            {user.plate.map((_, i) => (
              <View
                key={i.toString()}
                style={[
                  styles.dot,
                  { backgroundColor: i === activeIndex ? '#43975a' : 'rgba(67, 151, 90, 0.4)' },
                  { width: i === activeIndex ? 12 : 8, height: i === activeIndex ? 12 : 8, }
                ]}
              />
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aún no tienes matrículas registradas.</Text>
          <Text style={styles.emptyStateText}>Presiona el botón para añadir una nueva.</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {setModalVisible(true);}}
      >
        <MaterialIcons name="add" size={30} color="#1a1a19" />
      </TouchableOpacity>

      <PatenteModal
        visible={modalVisible}
        onClose={() => {setModalVisible(false);}}
      />

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
        onConfirmPressed={() => handleDelete(selectedPlateToDelete)}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a19',
    paddingTop: 40,
    paddingBottom: 120
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a19',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#e6e6e6',
    fontSize: 16,
  },
  title: {
    fontFamily: 'arial',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#43975a',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
    top: 15
  },
  platesCarouselContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 80,
    marginTop: 20,

  },
  plateCardContainer: {
    width: width * 0.8,
    marginHorizontal: width * 0.05,
    borderRadius: 15,

    alignItems: 'center'
  },

  plateNumberText: {
    fontFamily: 'FE-Font',
    fontSize: 28,
  },
  oldPlateText: {
    color: '#fff',
    fontSize: 32,
    top: 1,
  },
  newPlateText: {
    color: '#000',
    fontSize: 48,
    top: 2,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
  },
  plateCardBottom: {
    backgroundColor: '#43975a',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    width: '85%',
    alignSelf: 'center',
    marginTop: -20,
    marginBottom: 10,
    minHeight: 100,
    justifyContent: 'center',
    zIndex: 1,
  },
  plateInfoTitle: {
    color: '#1a1a19',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  plateInfoSubtitle: {
    color: '#30302f',
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 6,
    bottom: 150
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: '42%',
    bottom: '20%',
    backgroundColor: '#43975a',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyStateText: {
    color: '#b0b0b0',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
  alertConfirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    fontSize: 18,
  },
  alertCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    fontSize: 18,
  },
  alertTitle: {
    color: '#e6e6e6',
    fontWeight: 'bold'
  },
  alertMessage: {
    color: '#e6e6e6',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 16
  },
  alertContentContainer: {
    backgroundColor: '#1a1a19'
  },
  
});