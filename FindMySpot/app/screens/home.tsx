import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '@/context/UserContext';
import HomeButtons from '@/components/homeButtons'
import { EyeIconClosed, EyeIconOpen} from '@/components/icons';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
    const { user } = useUser();
    const [secureBalance, setSecureBalance] = useState(false)

  return (
    <View style={styles.container}>
      <View style={styles.headerGrid}>
        <View style={styles.header}>
          <Text style={styles.headerText}> Bienvenido, {user.name && user.name[0].toUpperCase() + user.name.slice(1)}</Text>   
        </View>

    </View>

      <View style={styles.body}>
        <Text style={styles.label}>Saldo disponible</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap:10}}>
          <Text style={styles.balance}> 
            $ {secureBalance ? "*****" : "10000"}
          </Text>
          <TouchableOpacity style={{justifyContent: 'center'}} onPress={() => setSecureBalance(!secureBalance)}> 
            {secureBalance ? <EyeIconClosed/> : <EyeIconOpen/>}
          </TouchableOpacity>
        </View>
        

        <TouchableOpacity style={styles.questionButton}>
          <Text style={styles.questionText}>?</Text>
        </TouchableOpacity>

        <Text style={styles.label}>¿Qué quieres hacer hoy?</Text>
        <View style={styles.buttonGrid}>
          <HomeButtons 
                    tittle='New Park'
                    onPress={() => useRouter().push('/screens/parking')}
                  />
                  <HomeButtons 
                    tittle='Mis Cars'
                  />
                  <HomeButtons 
                    tittle='Historial'
                  />
                  <HomeButtons 
                    tittle='Multas'
                  />
        </View>

        <Text style={styles.label}>Novedades</Text>
        <ScrollView horizontal style={styles.carousel} showsHorizontalScrollIndicator={false}>
          <View style={styles.carouselItem} />
          <View style={styles.carouselItem} />
          <View style={styles.carouselItem} />
          <View style={styles.carouselItem} />
          <View style={styles.carouselItem} />
        </ScrollView>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGrid:{
    flexDirection: 'row',
    justifyContent: 'space-between'

  },
  container: { flex: 1 },
  header: {
    backgroundColor: '#000000',
    height: 70,
    width: "100%",
    paddingTop: 30,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerText: { color: 'white', fontSize: 16 },
  body: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: { marginTop: 10, marginBottom: 5, fontSize: 14 },
  balance: { fontSize: 30, fontWeight: 'bold' },
  questionButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  questionText: { fontSize: 24 },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  
  carousel: {
    marginTop: 10,
  },
  carouselItem: {
    width: 100,
    height: 80,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginRight: 10,
  },
});