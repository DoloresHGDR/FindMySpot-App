import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import { useUser } from '@/context/UserContext';
import HomeButtons from '@/components/homeButtons'
import { EyeIconClosed, EyeIconOpen, HomeLines } from '@/components/icons';
import { useRouter } from 'expo-router';
import { removeToken } from '@/services/storage';
import { setupFirebaseMessaging } from '@/services/firebaseMessagingService';
import Carousel from '@/components/carousel';


export default function HomeScreen() {
    const { user, logout } = useUser();
    const [secureBalance, setSecureBalance] = useState(false)
    const router = useRouter();

    const novedades = [
    { image: require('@/assets/images/prueba.jpg'), title: 'Dinero que se mueve contigo' },
    ];

    const handleLogOut = async () => {
      await logout();
      await removeToken();
      router.replace('/auth/login')
    };

    useEffect(() => {
      if (!user?.logged) return;

      let cleanup: (() => void) | undefined;

      (async () => {
        cleanup = await setupFirebaseMessaging();
      })();

      return () => {
        if (cleanup) cleanup();
      };
    }, [user]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.headerGrid}>
        <View style={styles.header}>
          <Text style={styles.headerText}> Bienvenido, {user.name && user.name[0].toUpperCase() + user.name.slice(1)}</Text> 
          <TouchableOpacity onPress={()=> {handleLogOut()}}>
            <Image source={require('@/assets/images/logout.png')} style={{resizeMode: 'contain', width: 24, height: 24, paddingTop: 32}} />
          </TouchableOpacity>  
        </View>

        <HomeLines/>
    </View>

      <View style={styles.body}>
        <Text style={[styles.label, {color:'#e9e9e9', fontSize:15, fontWeight:"600",fontFamily:"arial"}]}>Saldo disponible</Text>
        <View style={[{flexDirection: 'row', flexWrap: 'wrap', gap: 10}]}>
          <Text style={[styles.balance, {color:"#43975a"}]}> 
            $ {secureBalance ? "*****" : "10000"}
          </Text>
          <TouchableOpacity style={[{justifyContent: 'center'}]} onPress={() => setSecureBalance(!secureBalance)}> 
            {secureBalance ? <EyeIconClosed/> : <EyeIconOpen/>}
          </TouchableOpacity>
        </View>
        

        <TouchableOpacity style={styles.containerCard}>
          <Image source={require("@/assets/images/card.jpg")} style={styles.cardImage}/>
          <View style={styles.containerCardText}>
            <Text numberOfLines={1} style={styles.cardTitle}>Mi tarjeta</Text>
            <Text numberOfLines={4} style={styles.cardText}>Recarga tu saldo aquí</Text>
          </View>
        </TouchableOpacity>

        <Text style={[styles.label, {color:'#e9e9e9', fontFamily:'arial', fontSize:15} ]}>¿Qué quieres hacer hoy?</Text>
        <View style={styles.buttonGrid}>
                  <HomeButtons 
                    tittle='Estacionamiento'
                    onPress={() => useRouter().push('/screens/parking')}
                  />
                  <HomeButtons 
                    tittle='Matriculas'
                    onPress={() => useRouter().push('/screens/plates')}
                  />
                  <HomeButtons 
                    tittle='Historial'
                    onPress={() => useRouter().push('/screens/history')}
                  />
                  <HomeButtons 
                    tittle='Multas'
                    onPress={() => useRouter().push('/screens/fines')}
                  />
        </View>
        <Carousel title="Novedades" items={novedades} />
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerGrid:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: { flex: 1 },
  header: {
    backgroundColor: '#1b1a17',
    height: 75,
    width: "100%",
    paddingTop: 40,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    flexDirection: 'row'
  },
  headerText: { 
    color: '#90d6a6',
    fontSize: 18,
    paddingTop: 5,
    left: -5
   },
  body: {
    flex: 1,
    backgroundColor: '#1b1a17',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: { 
    marginTop: 20,
    marginBottom: 5,
    fontSize: 14
  },
  balance: { 
    fontSize: 30,
    fontWeight: 'bold'
  },
  containerCard: {
    alignSelf: 'center',
    shadowColor: "#36ca5dff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 12,
    width: '95%',
    height: '10%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#43975a',
    borderWidth: 1,
    backgroundColor: '#1a1a19',
    marginTop: 30,
    marginBottom: 15,
    flexDirection: "row",
    zIndex: 10,
    position: "relative"
  },
  cardText: {
    fontSize: 12,
    color: '#e6e6e6',
    top: 6
  },
  cardTitle: {
    fontSize: 14,
    color: '#e6e6e6',
    fontWeight: "bold"
  },
  containerCardText: {
    top: 5,
    marginLeft: 28
  },
  cardImage: {
    resizeMode: 'stretch',
    width: 58,
    height: 58,
    top: 3.45,
    left: 8
  },
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