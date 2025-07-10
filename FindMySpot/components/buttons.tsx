import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
    tittle: string,
    onPress?: () => void
}

export default function Buttons({ tittle, onPress}: Props) {
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
    color: '#43975a'
  },
  
actionButton: {
    width: '50%',
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#223726',
    borderColor:"#223726"
  },
})