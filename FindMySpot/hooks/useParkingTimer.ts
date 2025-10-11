import { useEffect, useState } from "react";
import { getParkingData } from "@/services/local/storage/parkingStorage";
import { calculateRemainingTime } from "@/utils/timer";

export const useParkingTimer = (onFinish?: () => void) => {
    const [remainingTime, setRemainingTime] = useState<number>(0);

    useEffect(() => {
        const loadParkingData = async () => {
            const parkingData = await getParkingData();
            if(parkingData) {
                const timeLeft = calculateRemainingTime(parkingData.startTime, parkingData.duration);
                setRemainingTime(timeLeft);
            }
        };

        loadParkingData();

        const interval = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1000) {
                    clearInterval(interval);
                    onFinish?.();
                    return 0;
                }
                return prev - 1000;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [onFinish]);

    return remainingTime
}