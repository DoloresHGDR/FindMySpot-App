import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function headerHome() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mi Encabezado</Text>
      </View>
      <View style={styles.content}>
        <Text>Contenido principal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6200EE',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
