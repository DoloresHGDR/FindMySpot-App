import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function LoginButton({ title, onPress }: { title: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginTop: 20,
    backgroundColor: '#151717',
    borderRadius: 10,
    height: 50,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
  },
});