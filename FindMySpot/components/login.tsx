import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Checkbox from "expo-checkbox";
import Svg, { Path } from 'react-native-svg';
import { Formik } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    dni: Yup.string()
        .required('El DNI es necesario')
        .matches(/^\d+$/, 'Solo se permiten numeros'),

    password: Yup.string()
        .required('La contraseña es necesaria')
        .min(8, 'Minimo 8 caracteres'),
});

function Login() {
    const [isChecked, setChecked] = useState(false);
    const [secureText, setSecureText] = useState(true);

    const EyeIconOpen = () => (
        <Svg 
            className="w-6 h-6 text-gray-800 dark:text-white" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <Path 
                fill-rule="evenodd" 
                d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" 
                clip-rule="evenodd"/>
        </Svg>
    );

    const EyeIconClosed = () => (
        <Svg className="w-6 h-6 text-gray-800 dark:text-white" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <Path 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
        </Svg>
    );

    const DniIcon = () => (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-id-badge-2">
            <Path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <Path d="M7 12h3v4h-3z" />
            <Path d="M10 6h-6a1 1 0 0 0 -1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1 -1v-12a1 1 0 0 0 -1 -1h-6" />
            <Path d="M10 3m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
            <Path d="M14 16h2" />
            <Path d="M14 12h4" />
        </Svg>
    );

    const LockIcon = () => (
        <Svg className="w-6 h-6 text-gray-800 dark:text-white" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"/>
        </Svg>

    )

  return (
    <Formik
        initialValues={{dni: '', password: ''}}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
            console.log('Valores enviados', values);
        }}
    >

        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.container}>
                <Text style={styles.label}>DNI</Text>
                <View style={styles.dniContainer}>
                    <View style={styles.iconContainer}>
                        <DniIcon/>
                    </View>
                    <TextInput
                    placeholder="Ingrese su DNI"
                    style={styles.dniInput}
                    onChangeText={handleChange('dni')}
                    onBlur={handleBlur('dni')}
                    value={values.dni}
                    keyboardType="numeric"
                    />
                </View>
                {touched.dni && errors.dni && (
                    <Text style={styles.error}>{errors.dni}</Text>
                )}

                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordContainer}>
                    <View style={styles.iconContainer}>
                      <LockIcon/>
                    </View>
                    <TextInput
                    placeholder="Ingrese su contraseña"
                    style={styles.passwordInput}
                    secureTextEntry={secureText}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    />
                    <TouchableOpacity
                    onPress={() => setSecureText(!secureText)}
                    style={styles.eyeIcon}
                    >
                      {secureText ? <EyeIconClosed /> : <EyeIconOpen />}
                    </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                )}

            <View style={styles.checkbox}>
                <Checkbox
                  value={isChecked}
                  onValueChange={setChecked}
                  color={isChecked ? '#000' : undefined}
                />
                <Text style={{ marginLeft: 8 }}>Recuérdame</Text>
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={()=> handleSubmit()}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <Text>¿No tienes una cuenta?</Text>
            </View>
        )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 30,
    width: 330,
    borderRadius: 20,
    gap: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
    marginBottom: 3
  },
  dniContainer: {
    borderWidth: 1.5,
    borderColor: '#ecedec',
    borderRadius: 10,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  dniInput: {
    flex: 1,
    height: '100%',
    paddingLeft: 0,
  },
  iconContainer: {
    marginRight: 10,
  },
  passwordContainer: {
    borderWidth: 1.5,
    borderColor: '#ecedec',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 10,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingLeft: 0,
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  eyeIcon: {
    padding: 5,
  },
  loginBtn: {
    marginTop: 20,
    backgroundColor: '#151717',
    borderRadius: 10,
    height: 50,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  }
 
});

export default Login;
