import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

type LoginButtonProps = {
    title: string;
    onPress: () => void;
    isLoading?: boolean; 
    disabled?: boolean; 
};

export default function LoginButton({ title, onPress, isLoading = false, disabled = false }: LoginButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity style={[styles.btn, isDisabled && styles.btnDisabled]} onPress={onPress} disabled={isDisabled}>
      {isLoading ? (
        <ActivityIndicator color="#43985b" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginTop: 20,
    backgroundColor: '#223826',
    borderRadius: 10,
    height: 50,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: '#43985b',
  },
  btnDisabled: {
    opacity: 0.5,
  },
});