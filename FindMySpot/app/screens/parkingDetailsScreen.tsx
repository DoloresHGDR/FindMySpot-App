import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';


export default function ParkingDetailsScreen() {
    const { startDate, endDate, address, plate, duration, price } = useLocalSearchParams();
    const formatParkingDate = (dateString: string) => {
    const date = new Date(dateString);
        return format(date, "dd MMM 'a las' HH:mm");
    };

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>Parking realizado</Text>
            </View>
            <View style={styles.infoParking}>
                {[  
                    { label: 'Dirección', value: address },
                    { label: 'Fecha de inicio', value: formatParkingDate(String(startDate)) },
                    { label: 'Fecha de finalización', value: formatParkingDate(String(endDate)) },
                    { label: 'Patente', value: plate },
                    { label: 'Duración', value: duration },
                ].map((item, index) => (
                    <View key={index} style={{ marginBottom: 8 }}>
                    <Text style={styles.label}>{item.label}</Text>
                    <Text style={styles.detail}>{item.value}</Text>
                    </View>
                ))}
                <View style={styles.infoFooter}>
                    <Text style={styles.detail}>Monto Final</Text>
                    <Text style={styles.price}>${Number(price).toLocaleString('es-AR')}</Text>
                </View>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1a1a19',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#e6e6e6'
    },
    detail: {
        fontSize: 18,
        color: '#e6e6e6',
        marginBottom: 10,
    },
    date: {
        fontSize: 12,
        color: '#777777ff'
    },
    infoContainer: {
        flex: 1,
        top: 40,
        maxHeight: '10%',
        marginBottom: 80
    },
    infoParking: {
        padding: 25,
        borderRadius: 10,
        borderTopColor: '#43975a',
        borderTopWidth: 1,
        marginHorizontal: -25,
        
    },
    label: {
        fontSize: 14,
        color: '#e6e6e6',
    },
    infoFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        color: '#e6e6e6',
        padding: 25,
        borderBottomColor: '#43975a',
        borderBottomWidth: 1,
        borderTopColor: '#43975a',
        borderTopWidth: 1,
        marginHorizontal: -25,
        justifyContent: 'space-between',
    },
    price: {
        fontSize: 18,
        color: '#e6e6e6',
        maxWidth: 200,
        flexShrink: 1,
        marginBottom: 10,
    },
});