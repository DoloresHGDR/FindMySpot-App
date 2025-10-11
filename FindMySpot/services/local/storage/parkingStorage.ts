import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveParkingData = async (parkingData: { startTime: string; duration: number }) => {
    try {
        await AsyncStorage.setItem('parkingData', JSON.stringify(parkingData));
        console.log('parkingData guardado correctamente');
    } catch (error) {
        console.error('Error saving parking data', error);
    }
};

export const getParkingData = async () => {
    try {
        const data = await AsyncStorage.getItem('parkingData');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error retrieving parking data', error);
        return null;
    }
};

export const clearParkingData = async () => {
    try {
        await AsyncStorage.removeItem('parkingData');
        console.log('parkingData eliminado correctamente');
    } catch (error) {
        console.error('Error eliminando parkingData', error);
    }
};