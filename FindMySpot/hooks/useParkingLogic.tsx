import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { submitParking, stopParking } from '@/services/parkingService';
import { saveParkingData, clearParkingData, getParkingData } from '@/services/parkingStorage';
import { useParkingHistory } from '@/hooks/useParkingHistory';
import { setTimeOffset } from '@/utils/timer';

interface UseParkingLogicProps {
  userId: string | null;
  userPlates: { id: number; number: string }[] | undefined;
}

export interface HistoryDTO {
  id: string;
  startDate: string;
  endDate: string;
  address: string;
  plate: string;
  duration: string;
  price: string;
}

export const useParkingLogic = ({ userId, userPlates}: UseParkingLogicProps) => {
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [parkingActive, setParkingActive] = useState(false);
    const [selectedParkingData, setSelectedParkingData] = useState<HistoryDTO | null>(null);
    const {loadHistory, lastParking} = useParkingHistory();


    const handleSubmit = async (data: { plate: string; address: string; duration: string }) => {
        try {
            const submit = await submitParking(userId, data.plate, data.address, data.duration);
            setModalVisible(false);
            loadHistory();
            setTimeOffset(submit.startTime); 
            await saveParkingData({
                startTime: submit.startTime,
                duration: Number(submit.durationMinutes),
                });
            setParkingActive(true);
        } catch (error) {
            Alert.alert('Error', 'No se pudo iniciar el estacionamiento.');
            console.log(error);
        }
    };

    const handleConfirmRepark = () => {
        setShowAlert(false);
        if (!selectedParkingData) return;

        if (parkingActive) {
        Alert.alert('Error', 'Ya tenés un estacionamiento activo.');
        return;
        }

        let numericDuration = selectedParkingData.duration.replace(/\D/g, '');

        if (Number(numericDuration) < 10) numericDuration = '10';

        const matchedPlate = userPlates?.find(
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
            if (lastParking) handleStopParking(lastParking.id);
            else console.log('No se encuentra el último estacionamiento.');
        } else setModalVisible(true);
    };

    const handleStopParking = async (parkingId: string) => {
        try {
        await stopParking(parkingId);
        await clearParkingData();
        setParkingActive(false);
        loadHistory();
        Alert.alert('Finalizado', 'Se detuvo el estacionamiento');
        } catch (error) {
        console.error(error);
        }
    };

    const handleFinishPark = async () => {
        await clearParkingData();
        setParkingActive(false);
        loadHistory();
    }
 
    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    useEffect(() => {
    const checkParking = async () => {
      const parkingData = await getParkingData();
      if (parkingData) setParkingActive(true);
    };
    void checkParking();
  }, []);

    useEffect(() => {
        loadHistory();
    }, [parkingActive]);

    return {
        refreshing,
        modalVisible,
        lastParking,
        showAlert,
        parkingActive,
        selectedParkingData,
        setSelectedParkingData,
        setShowAlert,
        setModalVisible,
        handleConfirmRepark,
        handleParkingButtonPress,
        handleStopParking,
        handleSubmit,
        onRefresh,
        setParkingActive,
        handleFinishPark
    };
};
