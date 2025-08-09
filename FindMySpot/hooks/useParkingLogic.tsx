import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { fetchHistory, fetchNearbyParkingLocations, submitParking, stopParking } from '@/services/parkingService';
import { getUserLocation } from '@/utils/location';
import { scheduleParkingEndingNotification } from '@/services/notification';
import * as Notifications from 'expo-notifications';

export interface HistoryDTO {
  id: string;
  startDate: string;
  endDate: string;
  address: string;
  plate: string;
  duration: string;
  price: string;
}

type MarkerType = {
  id: number;
  latitude: number;
  longitude: number;
};

interface UseParkingLogicProps {
  userId: string | null;
  userPlates: { id: number; number: string }[] | undefined;
  googleApiKey: string;
}

export const useParkingLogic = ({ userId, userPlates, googleApiKey }: UseParkingLogicProps) => {
    const [notificationId, setNotificationId] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [markers, setMarkers] = useState<MarkerType[]>([]);
    const [region, setRegion] = useState({
        latitude: -34.616158,
        longitude: -68.329941,
        latitudeDelta: 0.005,
        longitudeDelta: 0.02,
    });
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [history, setHistory] = useState<HistoryDTO[]>([]);
    const [lastParking, setLastParking] = useState<HistoryDTO | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
    const [parkingActive, setParkingActive] = useState(false);
    const [selectedParkingData, setSelectedParkingData] = useState<HistoryDTO | null>(null);

    const fetchUserLocation = async () => {
        const coords = await getUserLocation();
        if (coords) setUserLocation(coords);
    };

    const fetchParkingLocations = async () => {
        if (!userLocation) return;
        const nearbyMarkers = await fetchNearbyParkingLocations(userLocation, googleApiKey);
        setMarkers(nearbyMarkers);
    };
    
    const manageParkingNotification = async (parkingEndDate: Date | null) => {
        if (!parkingEndDate) {
            if (notificationId) {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
                setNotificationId(null);
            }
            return;
        }

        const now = new Date();
        const triggerDate = new Date(parkingEndDate.getTime() - 5 * 60 * 1000);
        
        if (triggerDate <= now) {
            if (notificationId) {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
                setNotificationId(null);
            }
            return;
        }

        if (notificationId) {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        }

        const newId = await scheduleParkingEndingNotification(parkingEndDate);
        setNotificationId(newId || null);
    };

    const loadHistory = async () => {
        if (!userId) return;
        try {
        const data = await fetchHistory(userId);
        setHistory(data);

        if (data.length > 0) {
            const latest = data[0];
            setLastParking(latest);

            await manageParkingNotification(new Date(latest.endDate));

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
        } else {
            setLastParking(null);
            setRemainingSeconds(null);
            setParkingActive(false);
            await manageParkingNotification(null);
        }
        } catch (error) {
        console.error('Error al obtener el historial de estacionamiento', error);
        }
    };

    const handleSubmit = async (data: { plate: string; address: string; duration: string }) => {
        if (!userId) return;
        try {
        const submit = await submitParking(userId, data.plate, data.address, data.duration);
        setLastParking(submit);
        setModalVisible(false);
        loadHistory();
        } catch {
        Alert.alert('Error', 'No se pudo iniciar el estacionamiento.');
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
        setRemainingSeconds(0);
        setParkingActive(false);
        Alert.alert('Finalizado', 'Se detuvo el estacionamiento');
        loadHistory();
        } catch (error) {
        console.error(error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchUserLocation();
    }, []);

    useEffect(() => {
        if (userLocation) fetchParkingLocations();
    }, [userLocation]);

    useEffect(() => {
        loadHistory();
    }, [parkingActive]);

    return {
        refreshing,
        modalVisible,
        markers,
        region,
        history,
        lastParking,
        showAlert,
        remainingSeconds,
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
    };
};
