import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface Props {
  step: number;
  maxSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function RegisterButtons({ step, maxSteps, onNext, onBack, onSubmit, isLoading = false }: Props) {

  const isSubmitDisabled = isLoading;
  const isSingleButton = step === 0 && step < maxSteps - 1; 
  const nextButtonMargin = isSingleButton ? 170 : 20;

  return (
    <View style={styles.buttons}>
      {step > 0 && (
        <TouchableOpacity style={styles.button} onPress={onBack} disabled={isLoading}>
          <Text style={styles.text}>Atrás</Text>
        </TouchableOpacity>
      )}
      {step < maxSteps - 1 ? (
        <TouchableOpacity style={[
            styles.button, 
            { marginLeft: nextButtonMargin }, 
            isLoading && styles.disabledButton
          ]} 
          onPress={onNext}
          disabled={isLoading}>
          <Text style={styles.text}>Siguiente</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, isSubmitDisabled && styles.disabledButton]} 
          onPress={onSubmit}
          disabled={isSubmitDisabled}
          >
          {isLoading ? (
            <ActivityIndicator color="#43985b" />
          ) : (
           <Text style={styles.text}>Registrarse</Text>
          )}
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
  disabledButton: {
    opacity: 0.5, 
  },
});