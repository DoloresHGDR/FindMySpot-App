import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { KeyboardTypeOptions } from 'react-native';


interface InputProps {
  icon?: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e?: any) => void;
  placeholder: string;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;

}

export default function Input({
  icon,
  value,
  onChangeText,
  onBlur,
  placeholder,
  rightIcon,
  onPress,
  keyboardType,
  secureTextEntry

}: InputProps) {
  return (
    <View style={styles.container}>
      {icon ? (
        <View style={styles.iconContainer}>{icon}</View>
      ): null}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType= {keyboardType}
      />
      {rightIcon ? (
        <TouchableOpacity onPress={onPress} style={styles.eyeIcon}>
          {rightIcon}
        </TouchableOpacity>
      ): null}
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderColor: '#ecedec',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  eyeIcon: {
    padding: 5,
  },
});