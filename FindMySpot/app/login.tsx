import { View, Text, StyleSheet, TextInput } from 'react-native';

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.tittle}>Bienvenido a Find My Spot</Text>
      <Text style={styles.paragraph}>
        La forma más práctica y segura de gestionar tu estacionamiento. Desde aquí podrás reservar tu lugar por tiempo limitado, consultar el estado de tus vehículos, y revisar posibles infracciones, todo desde un solo lugar.
      </Text>

      <View style={styles.input}>
        <TextInput
          placeholder="Escriba aquí"
          style={styles.input}
        />
      </View>

      <View style={styles.input}>
        <TextInput
          placeholder="Escriba aquí"
          style={styles.input}
        />
      </View>
    </View>
  );
}
// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  tittle: {
    fontSize: 40,
    fontFamily: 'Roboto',
    marginBottom: 20,
  },

  paragraph: {
    fontSize: 20,
    marginBottom: 30,
  },

  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
