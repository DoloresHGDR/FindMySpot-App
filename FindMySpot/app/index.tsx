import { Text, View, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/Input';
import LoginButton from "@/components/loginButton";
import { EyeIconOpen, EyeIconClosed, DniIcon, LockIcon } from '@/components/icons';
import Checkbox from "expo-checkbox";
import { useRouter } from 'expo-router';
import axios, { AxiosError } from 'axios';



const LoginSchema = Yup.object().shape({
    identityNumber: Yup.string()
        .required('El DNI es necesario')
        .matches(/^\d+$/, 'Solo se permiten numeros'),

    password: Yup.string()
        .required('La contraseña es necesaria')
        .min(8, 'Minimo 8 caracteres'),
});

export default function Index() {
    const router = useRouter();
    const [isChecked, setChecked] = useState(false);
    const [secureText, setSecureText] = useState(true);

  const handleLogin= async (values) => {
      try {
        console.log(values)
        const response = await axios.post('http://192.168.18.2:8080/api/users/login', {
          identityNumber: values.identityNumber,
          password: values.password,
        });
        console.log(response)
      } catch (err) {
        const error = err as AxiosError;
  
        if (error.response) {
          console.log('Error', error.response.data as string)
          Alert.alert('Error', error.response.data as string || "Hubo un error al registrar al usuario")
        } else {
          Alert.alert('Error', "No se pudo conectar con el servidor.")
        }
          
      }
    }

  return (
    <Formik
          initialValues={{ identityNumber: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            handleLogin(values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.container}>
              <Text style={styles.label}>DNI</Text>
              <Input
                icon={<DniIcon />}
                placeholder="Ingrese su DNI"
                value={values.identityNumber}          
                onChangeText={handleChange('identityNumber')}
                onBlur={handleBlur('identityNumber')}
                keyboardType="numeric"
              />
              {touched.identityNumber && errors.identityNumber && (
                <Text style={styles.error}>{errors.identityNumber}</Text>
              )}
              <Text style={styles.label}>Contraseña</Text>
              <Input
                icon={<LockIcon />}
                placeholder="Ingrese su contraseña"
                value={values.password}
                secureTextEntry={secureText}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                rightIcon={secureText ? <EyeIconClosed /> : <EyeIconOpen />}
                onPress={() => setSecureText(!secureText)}
              />
              {touched.password && errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

              <View style={styles.checkbox}>
                <Checkbox value={isChecked} onValueChange={setChecked} color={isChecked ? '#000' : undefined} />
                <Text style={{ marginLeft: 8 }}>Recuérdame</Text>
              </View>

              <LoginButton title="Login" onPress={handleSubmit} />

              <View style={styles.registerContainer}>
              <Text>¿No tienes una cuenta?</Text>
              <Text
                  style={{ color: 'blue', fontWeight: 'bold' }}
                  onPress={() => router.push('/register')}
                >
                Regístrate
                </Text>
              </View>
              
            </View>
          )}
        </Formik>
      );
    }

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 20,
    width: 330,
    alignSelf: 'center',
    marginTop: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 3,
    marginLeft: 4,
    marginBottom: 5,
  },
  registerContainer:{
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 5
  }
});
