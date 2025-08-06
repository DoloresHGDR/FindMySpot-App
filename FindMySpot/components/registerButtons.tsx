import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  step: number;
  maxSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function RegisterButtons({ step, maxSteps, onNext, onBack, onSubmit }: Props) {
  return (
    <View style={styles.buttons}>
      {step > 0 && (
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.text}>Atrás</Text>
        </TouchableOpacity>
      )}
      {step < maxSteps - 1 ? (
        <TouchableOpacity style={[styles.button, { marginLeft: step > 0 ? 20 : 170 }]} onPress={onNext}>
          <Text style={styles.text}>Siguiente</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.text}>Registrarse</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    bottom: 75,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    gap: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#223826',
    borderRadius: 10,
    height: 50,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: '#43985b',
  },
});