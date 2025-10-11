import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function HomeFooter() {
    const router = useRouter();
    const pathname = usePathname();

    const handleRoute = () => {
        const homePath = "/screens/home";

        if (pathname !== homePath) {
            router.push(homePath)
        }
    }

  return (
    <View style={styles.container}>
        <View style={styles.footer}>
            <View style={styles.containerButton}></View>
            <TouchableOpacity style={styles.button} onPress={handleRoute}>
                <Image source={require("@/assets/images/home.png")} style={styles.imageIcon}/>
            </TouchableOpacity>
        </View>
        
    </View>
  );
}

const styles = StyleSheet.create({

  footer: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    backgroundColor: "#1b1a17",
    borderRadius: 25,
    borderColor: "#43975a",
    height: 80,
    width: '102%',
    alignItems: "center",
    bottom: -5,
    position: "absolute",
  },
  containerButton: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#43975a',
    height: 60,
    width: 60,
    top: -20,
    backgroundColor: "#1b1a17",
    position: "absolute",
  },
  container: {
    backgroundColor: "#1b1a17",
    alignItems: "center",
    maxHeight: '100%',
  },
  imageIcon: {
    resizeMode: "cover",
    width: 42,
    height: 42,
  },
  button: {
    top: -14
  }
});