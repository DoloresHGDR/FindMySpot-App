import { Text, View, StyleSheet } from 'react-native';
import { useParkingTimer } from '@/hooks/useParkingTimer';
import { formatTime } from '@/utils/timer';
import { useFonts, Copse_400Regular, RobotoMono_400Regular} from '@expo-google-fonts/dev'

interface ParkingTimerProps {
    onFinish?: () => void;
}

const ParkingTimer: React.FC<ParkingTimerProps> = ({ onFinish }) => {

    let [fontsLoaded] = useFonts({
      Copse_400Regular,
      RobotoMono_400Regular
    });

    const remainingTime = useParkingTimer(onFinish);
    if (!fontsLoaded) {
      return null;
    } else {
    return (
        <View>
          <View style={styles.container}>
              <Text style={styles.timer}>{formatTime(remainingTime)}</Text>
          </View>
        </View>
        
    );
  }
};

const styles = StyleSheet.create({
  timer: {
    color: '#43975a',
    fontSize: 28,
    fontFamily: "RobotoMono_400Regular"
  },
  container: {
    alignSelf: 'center',
    shadowColor: "#36ca5dff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 12,
    width: '45%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#43975a',
    borderWidth: 1,
    backgroundColor: '#1a1a19',
    marginTop: 7.5,
    marginBottom: 15

  }

});

export default ParkingTimer;