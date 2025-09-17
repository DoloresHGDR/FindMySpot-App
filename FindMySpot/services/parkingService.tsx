import apiClient from "@/api/apiClient";
import { getCoordinates, isNearby } from "@/utils/location";
import ParkingHistory from "@/models/history";


interface MarkerType {
    id: number;
    latitude: number;
    longitude: number;
}

export const fetchHistory = async (): Promise<ParkingHistory[]> => {
    const response = await apiClient.get(`/api/parkings/history/last-three`);
    return response.data;
}

export const submitParking = async (
    userId: string | null,
    plate: string,
    address: string,
    duration: string
) => {
    const response = await apiClient.post('/api/parkings/create', {
        userId,
        plateId: plate,
        address,
        durationMinutes: duration,
    });
    return response.data;
};

export const stopParking = async (parkingId: string) => {
    return apiClient.post(`/api/parkings/finish/${parkingId}`);
};

export const fetchNearbyParkingLocations = async (
    userCoords: {latitude: number, longitude: number} | null,
    apiKey: string
): Promise<MarkerType[]> => {
    const response = await apiClient.get('/api/parkings/about-to-finish/map');
    const parkings = response.data;

    const locations: MarkerType[] = [];

    for (const parking of parkings) {
        const fullAddress = `${parking.address}, San Rafael, Mendoza`;
        const coords = await getCoordinates(fullAddress, apiKey);
        if (coords) {
            const { lat, lng } = coords;

            if (userCoords) {
                const nearby = isNearby(userCoords.latitude, userCoords.longitude, lat, lng);
                if (nearby) {
                    locations.push({id: parking.id, latitude: lat, longitude: lng});
                }
            } else {
                locations.push({id: parking.id, latitude:lat, longitude: lng});
            }
        }
    }

    if (!userCoords) {
        locations.splice(20);
    }

    return locations;
}