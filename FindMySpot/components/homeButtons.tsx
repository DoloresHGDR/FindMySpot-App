import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
    tittle: string,
    onPress?: () => void
}

export default function HomeButtons({ tittle, onPress}: Props) {
  return (
    <TouchableOpacity style={[styles.actionButton]} onPress={onPress}>
        <Text style={styles.buttonText}>{tittle}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 20,
    paddingTop: 20,
    color: '#43975a'
  },
  
actionButton: {
    width: '47%',
    height: 80,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#223726',
    borderColor:"#223726"
  },
})