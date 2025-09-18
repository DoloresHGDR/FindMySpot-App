import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';

export default function HomeFooter() {
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.containerButton}></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    backgroundColor: "#1b1a17",
    borderRadius: 10,
    borderColor: "#43975a",
    height: 60,
    width: '100%',
    position: "absolute",
    bottom: 10,
    alignItems: "center",
  },
  containerButton: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#43975a',
    height: 60,
    width: 60,
    top: -15,
    backgroundColor: "#1b1a17",
    position: "absolute",
    zIndex: 10
  }
});