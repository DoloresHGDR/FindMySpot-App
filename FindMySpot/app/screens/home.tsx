import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser } from '@/context/UserContext';
import HomeButtons from '@/components/homeButtons';

export default function HomeScreen() {
    const { user } = useUser();

    return (
    <View>
        
    <Text style={styles.tittle}> Bienvenido, {user.name && user.name[0].toUpperCase() + user.name.slice(1)}</Text>
    <Text style={[styles.tittle,{fontSize: 40, paddingLeft: 25}]}> 0,01 $</Text>
    <Text style={[styles.tittle,{fontSize: 20}]}> ¿Que quieres hacer hoy? </Text>
      

      <View style={styles.buttonGrid}>
        <HomeButtons 
          tittle='New Park'
          color= '#f1948a'
        />
        <HomeButtons 
          tittle='Mis Cars'
          color= '#c39bd3'
        />
        <HomeButtons 
          tittle='Historial'
          color= '#f7dc6f'
        />
        <HomeButtons 
          tittle='Multas'
          color= '#76d7c4'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tittle: {
    justifyContent: 'space-between',
    padding: 15,
    fontSize: 25
  },

  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
    margin: 15
  },
  button: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 50,
  },
});
