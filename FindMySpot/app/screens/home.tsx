import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '@/context/UserContext';
import HomeButtons from '@/components/homeButtons'
import { EyeIconClosed, EyeIconOpen, HomeLines } from '@/components/icons';
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

        <HomeLines/>
    </View>

      <View style={styles.body}>
        <Text style={[styles.label, {color:'#e9e9e9', fontSize:15, fontWeight:"600",fontFamily:"arial"}]}>Saldo disponible</Text>
        <View style={[{flexDirection: 'row', flexWrap: 'wrap', gap:10}]}>
          <Text style={[styles.balance, {color:"#43975a"}]}> 
            $ {secureBalance ? "*****" : "10000"}
          </Text>
          <TouchableOpacity style={[{justifyContent: 'center', color:'#43975a'}]} onPress={() => setSecureBalance(!secureBalance)}> 
            {secureBalance ? <EyeIconClosed/> : <EyeIconOpen/>}
          </TouchableOpacity>
        </View>
        

        <TouchableOpacity style={styles.questionButton}>
          <Text style={styles.questionText}>?</Text>
        </TouchableOpacity>

        <Text style={[styles.label, {color:'#e9e9e9', fontFamily:'arial', fontSize:15} ]}>¿Qué quieres hacer hoy?</Text>
        <View style={styles.buttonGrid}>
                  <HomeButtons 
                    tittle='New Park'
                  />
                  <HomeButtons 
                    tittle='Mis Cars'
                    onPress={() => useRouter().push('/screens/mysCars')}
                  />
                  <HomeButtons 
                    tittle='Historial'
                  />
                  <HomeButtons 
                    tittle='Multas'
                  />
        </View>

        <Text style={[styles.label, {color:'#ffffff', fontFamily:'arial', fontSize: 15}]}>Novedades</Text>
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
    justifyContent: 'space-between',
  },
  container: { flex: 1 },
  header: {
    backgroundColor: '#1a1b18',
    height: 70,
    width: "100%",
    paddingTop: 30,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerText: { color: '#90d6a6', fontSize: 16 },
  body: {
    flex: 1,
    backgroundColor: '#1b1a19',
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