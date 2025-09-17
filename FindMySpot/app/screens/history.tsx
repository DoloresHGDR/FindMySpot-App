import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AxiosError } from 'axios';
import apiClient from '@/api/apiClient';
import { format } from 'date-fns';
import PlatePicker from "@/components/pickerPlate"
import { useUser } from '@/context/UserContext';
import ParkingHistory from '@/models/history';

export default function HistoryScreen () {
    const [parkings, setParkings] = useState<ParkingHistory[]>([]);
    const parkingIcon = require('@/assets/images/parking.png')
    const [selectedPlateId, setSelectedPlateId] = useState<number | null>(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchParkings = async () => {
            if (selectedPlateId) {
                const plateId = Number(selectedPlateId);
                try {
                    const response = await apiClient.get(`/api/parkings/history/user/${plateId}`);
                    setParkings(response.data)
                } catch (error) {
                    const err = error as AxiosError;
                    if (err.response) {
                        Alert.alert('Error', err.response.data as string || "Hubo un error al encontrar parkings")
                        console.log(err)
                    } else {
                        Alert.alert('Error', "No se pudo conectar con el servidor.")
                    }
                }
            };
            return;
        };
        
        fetchParkings();
    }, [selectedPlateId, user]);

    useEffect(() => {
        if (user?.plate?.length > 0) {
            setSelectedPlateId(user.plate[0].id);
        }
    }, [user]);

    const handlePlateChange = (plateId: number | null) => {
        setSelectedPlateId(plateId);
    };

    const handleViewDetails = (parking: any) => {
        useRouter().push({
            pathname: '/screens/parkingDetailsScreen',
            params: {
                startDate: parking.startDate,
                endDate: parking.endDate,
                address: parking.address,
                plate: parking.plate,
                duration: parking.duration,
                price: parking.price,
            },
        });
    };

    const formatParkingDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "dd MMM 'a las' HH:mm");
      };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
            <Text style={styles.title}> HISTORIAL </Text>
            <PlatePicker
                selectedPlateId={selectedPlateId}
                onPlateChange={handlePlateChange}
                plates={user.plate}
            />
            
            {parkings && selectedPlateId ? (
                <View style={styles.history}>
                    {parkings?.map((parking, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.historyItem}
                            onPress={() => handleViewDetails(parking)}
                        >
                            <Image source={parkingIcon} style={styles.icon} />

                            <View style={styles.infoContainer}>
                                <Text style={styles.date}>{formatParkingDate(parking.startDate)}</Text>
                                <Text style={styles.address} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{parking.address}</Text>
                            </View>

                            <Text style={styles.price} numberOfLines={1}>${parking.price.toLocaleString('es-AR')}</Text>

                        </TouchableOpacity>
                    ))}
                </View>
            ) : (<Text style={styles.title}> No tienes estacionamientos aun</Text>)}
            
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: '20%',
        paddingHorizontal: 10,
        backgroundColor: '#1a1a19'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 50, 
        color:'#ebebebff'

    },
    history: {
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#43975a',
        borderWidth: 1,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        borderBottomWidth: 2,
        borderColor: '#255833ff',

    },
    infoContainer: {
        flex: 1,
    },
    date: {
        fontSize: 12,
        color: '#777777ff'
    },
    address: {
        fontSize: 17,
        color: '#e6e6e6',
        maxWidth: '95%'
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        maxWidth: 100,
        flexShrink: 1,
        overflow: 'hidden',
       
    },
    icon: {
        marginRight: 15,
        resizeMode: 'contain',
        width: 30,
        height: 30,
    },
});