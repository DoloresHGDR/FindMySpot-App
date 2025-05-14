import { Text, View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../components/Input';
import LoginButton from "@/components/loginButton";
import { EyeIconOpen, EyeIconClosed, DniIcon, LockIcon } from '../components/icons';
import Checkbox from "expo-checkbox";

const LoginSchema = Yup.object().shape({
    dni: Yup.string()
        .required('El DNI es necesario')
        .matches(/^\d+$/, 'Solo se permiten numeros'),

    password: Yup.string()
        .required('La contraseña es necesaria')
        .min(8, 'Minimo 8 caracteres'),
});

export default function Index() {
  const [isChecked, setChecked] = useState(false);
  const [secureText, setSecureText] = useState(true);

  return (
    <Formik
          initialValues={{ dni: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            console.log('Enviado', values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.container}>
              <Text style={styles.label}>DNI</Text>
              <Input
                icon={<DniIcon />}
                placeholder="Ingrese su DNI"
                value={values.dni}          
                onChangeText={handleChange('dni')}
                onBlur={handleBlur('dni')}
                keyboardType="numeric"
              />
              {touched.dni && errors.dni && (
                <Text style={styles.error}>{errors.dni}</Text>
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

              <Text style={{ textAlign: 'center' }}>¿No tienes una cuenta?</Text>
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
  }
});
