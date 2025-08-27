import { fetchHistory } from "@/services/parkingService";
import { useCallback, useEffect, useState } from "react";


export interface HistoryDTO {
  id: string;
  startDate: string;
  endDate: string;
  address: string;
  plate: string;
  duration: string;
  price: string;
}

export const useParkingHistory = () => {
    const [history, setHistory] = useState<HistoryDTO[]>([]);
    const [lastParking, setLastParking] = useState<HistoryDTO | null>(null);

    const loadHistory = useCallback(async () => {
        try {
            const data = await fetchHistory();
            const historyArray = Array.isArray(data) ? data : [];
            setHistory(historyArray);
            setLastParking(historyArray[0] || null);
        } catch (error) {
            console.error('Error al obtener el historial de estacionamiento', error);
        }
    }, []);

    useEffect(() => {
        void loadHistory();
    }, [loadHistory])

    return {history, lastParking, loadHistory, setHistory};
};