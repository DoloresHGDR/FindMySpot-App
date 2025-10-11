import { fetchHistory } from "@/services/remote/parking/parkingService";
import { useCallback, useEffect, useState } from "react";
import HistoryDTO from "@/models/history"


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