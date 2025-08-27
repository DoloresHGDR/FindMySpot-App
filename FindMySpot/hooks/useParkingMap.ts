import { useEffect, useState } from "react";
import { fetchNearbyParkingLocations} from '@/services/parkingService';
import { getUserLocation } from '@/utils/location';

type MarkerType = {
  id: number;
  latitude: number;
  longitude: number;
};

export const useParkingMap = (googleApiKey: string) => {
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [markers, setMarkers] = useState<MarkerType[]>([]);
    const [region, setRegion] = useState({
        latitude: -34.616158,
        longitude: -68.329941,
        latitudeDelta: 0.005,
        longitudeDelta: 0.02,
    });

    const fetchUserLocation = async () => {
        const coords = await getUserLocation();
        if (coords) setUserLocation(coords);
    };

    const fetchParkingLocations = async () => {
        if (!userLocation) return;
        const nearbyMarkers = await fetchNearbyParkingLocations(userLocation, googleApiKey);
        setMarkers(nearbyMarkers);
    };

    useEffect(() => {
        void fetchUserLocation();
    }, []);

    useEffect(() => {
        void fetchParkingLocations();
    }, [userLocation]);

    return {userLocation, markers, region, setRegion}
}