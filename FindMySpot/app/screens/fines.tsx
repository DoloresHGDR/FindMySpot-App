import { fetchFines } from "@/services/finesService";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import FinesInterface from "@/models/fines"
import { formatDate } from '@/utils/format';
import PlatePicker from "@/components/pickerPlate"
import { useUser } from "@/hooks/useUserQuery";

export default function Fines() {
    const [fines, setFines] = useState<FinesInterface[] | null>();
    const { user } = useUser();
    const [selectedPlateId, setSelectedPlateId] = useState<number | null>(null);
    const [showDescriptionId, setShowDescriptionId] = useState<number | null>(null);
    const fineItem = require("@/assets/images/bill.png");

    useEffect(() => {
        const handleFines = async () => {
            const data = await fetchFines();
            setFines(data);
        };
    
        handleFines();
    }, []);

    useEffect(() => {
        if (user?.plate?.length > 0) {
            setSelectedPlateId(user.plate[0].id);
        }
    }, [user]);

    const handlePlateChange = (plateId: number | null) => {
        setSelectedPlateId(plateId);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
            <Text style={styles.title}>Mis Multas</Text>
            <PlatePicker
                selectedPlateId={selectedPlateId}
                onPlateChange={handlePlateChange}
                plates={user.plate}
                borderColor="#F44336"
            />
            

            {fines && selectedPlateId && (
                <View>
                {fines?.some((f) => f.plate.id === selectedPlateId) ? (
                    fines
                    .filter((f) => f.plate.id === selectedPlateId)
                    .map((fine, index) => 
                        <View style={styles.fines} key={index}>
                            <TouchableOpacity
                                style={styles.fineItem}
                                onPress={() => {setShowDescriptionId(showDescriptionId === fine.id ? null : fine.id)}}
                            >
                                <View style={styles.topRow}>
                                    <Image source={fineItem} style={styles.icon}/>
                                    <View style={styles.fineContainer}>
                                        <Text style={styles.date}>{formatDate(fine.datetime)}</Text>
                                        <Text style={styles.address} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{fine.address}</Text>
                                
                                    </View>
                                    <Text style={styles.price} numberOfLines={1}>${fine.amount.toLocaleString('es-AR')}</Text>
                                </View>
                                <View style={{marginLeft: 24}}>
                                    {showDescriptionId === fine.id ? (
                                        <View style={styles.description}>
                                            <Text style={styles.titleDescription}>Descripción</Text>
                                            <Text style={styles.textDescription}numberOfLines={7} ellipsizeMode='tail'>{fine.description}</Text>
                                        </View>
                                    ):(
                                    <Text style={styles.moreDetails}numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>Toca para ver detalles</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                ) : (
                    <Text style={{ color: 'gray', marginTop: 20 }}>
                    No hay multas para esta patente.
                    </Text>
                )}
                </View>
            )}
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
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
    picker: {
        borderColor: '#F44336',
        borderWidth: 1,
        borderRadius: 12,
        width: '50%',
        alignSelf: 'center',
        marginBottom: 50,
    },
    fineItem: {
        alignItems: 'flex-start',
        padding: 15,
        borderRadius: 10,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 0
    },
    fineText: {
        color:'white',
    },
    date: {
        fontSize: 12,
        color: '#777777ff'
    },
    fineContainer: {
        flex: 1
    },
    fines: {
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        borderBottomColor: '#F44336',
        borderWidth: 1,
        maxHeight: '100%',
        
    },
    address: {
        fontSize: 17,
        color: '#e6e6e6',
        maxWidth: '95%'
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F44336',
        maxWidth: 100,
        flexShrink: 1,
        overflow: 'hidden',
       
    },
    icon: {
        left: -12,
        resizeMode: 'contain',
        width: 24,
        height: 24,
    },
    moreDetails: {
        fontSize: 14,
        color: '#808080',
        maxWidth: '95%',
        marginTop: 10,
    },
    textDescription: {
        fontSize: 14,
        color: '#e6e6e6',
        maxWidth: '95%',
        marginLeft: 5
    },
    description: {
        width: '70%',
        marginTop: 10
    },
    titleDescription: {
        fontSize: 15,
        color: '#e6e6e6',
        fontWeight: 'bold'
    }
    
})    