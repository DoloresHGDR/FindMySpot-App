import { Text, View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useState } from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/Input';
import { useUser } from "@/context/UserContext";
import LoginButton from "@/components/loginButton";
import { EyeIconOpen, EyeIconClosed, DniIcon, LockIcon } from '@/components/icons';
import Checkbox from "expo-checkbox";
import { useRouter } from 'expo-router';
import { saveToken } from '@/services/storage';
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
    const { setUser } = useUser();

  const handleLogin= async (values: any) => {
      try {
        const response = await axios.post('http://192.168.1.40:8080/api/auth/login', {
          identityNumber: values.identityNumber,
          password: values.password,
        });

        const { token, id, name, surname, identityNumber, role, plates} = response.data
        if (isChecked) {
            await saveToken(token, isChecked);
        } else {
            await saveToken(token, false);
        }
        setUser ({
                logged:true,
                id: id,
                name: name,
                surname: surname,
                identityNumber: identityNumber,
                role: role,
                plate: plates
            });

        if (response.status === 200) {
          router.replace("/screens/home")
        }

      } catch (err) {
        const error = err as AxiosError;
  
        if (error.response) {
          console.log('Error', error)
          Alert.alert('Error', error.response.data as string || "DNI o Contraseña incorrectas.")
        } else {
          Alert.alert('Error', "No se pudo conectar con el servidor.")
        }
          
      }
    }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Formik
          initialValues={{ identityNumber: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            handleLogin(values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            
              <View style={styles.login}>
                <Text style={styles.label}>Ingrese su DNI</Text>
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
                <Text style={styles.label}>Ingrese su Contraseña</Text>
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
                  <Checkbox value={isChecked} onValueChange={setChecked} color={isChecked ? '#43985b' : undefined} />
                  <Text style={{ marginLeft: 8 , color: '#cecece'}}>Recuérdame</Text>
                </View>

                <LoginButton title="Login" onPress={handleSubmit} />

                <View style={styles.registerContainer}>
                  <Text style={{ color: '#cecece'}} >¿No tienes una cuenta?</Text>
                  <Text
                    style={{ color: '#43985b', fontWeight: 'bold' }}
                    onPress={() => router.push('/auth/register')}
                  >
                    Regístrate
                  </Text>
                </View>
                
              </View>
            
          )}
        </Formik>
      </View>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a19'
  },
  login: {
    justifyContent: 'center',
    backgroundColor: '#111111',
    padding: 30,
    borderRadius: 20,
    width: '85%',
    height: '100%',
    alignSelf: 'center',
    maxHeight: '50%',
    marginTop: '55%',
    
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#43985b',
    marginBottom: 5,
    marginTop: 25,
    paddingBottom: 5
    
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
