<<<<<<< HEAD
import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
=======
import Login from "@/components/login";
import { Text, View } from "react-native";
>>>>>>> 13196c7baaed500659263d35d5f38c8aa8ebf021

export default function HomeScreen() {
  return (
<<<<<<< HEAD
    <View style={styles.container}>
      <Text>Home</Text>
      <Link href="/login">View login</Link> 
=======
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Login/>
>>>>>>> 13196c7baaed500659263d35d5f38c8aa8ebf021
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
