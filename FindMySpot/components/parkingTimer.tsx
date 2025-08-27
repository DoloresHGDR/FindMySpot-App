import { Text, View, StyleSheet } from 'react-native';
import { useParkingTimer } from '@/hooks/useParkingTimer';
import { formatTime } from '@/utils/timer';
import { useEffect } from 'react';

interface ParkingTimerProps {
    onFinish?: () => void;
}

const ParkingTimer: React.FC<ParkingTimerProps> = ({ onFinish }) => {
    const remainingTime = useParkingTimer(onFinish);
    
    return (
        <View style={styles.container}>
            <Text style={styles.timer}>{formatTime(remainingTime)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a19',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  timer: {
    color: '#43975a',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default ParkingTimer;