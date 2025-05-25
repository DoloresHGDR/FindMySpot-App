import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
    tittle: string,
    color: string
}

export default function HomeButtons({ tittle, color}: Props) {
  return (
    <TouchableOpacity style={[styles.button,{backgroundColor: color}]}>
        <Text style={styles.buttonText}>{tittle}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 50,
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
  }

})