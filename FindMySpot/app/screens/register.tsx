import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

const RegisterSchema = Yup.object().shape({
  nombre: Yup.string()
    .required('El nombre es necesario')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo se permiten letras y espacios'),
  apellido: Yup.string()
    .required('El apellido es necesario')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo se permiten letras y espacios'),
  dni: Yup.string()
    .required('El DNI es necesario')
    .matches(/^\d+$/, 'Solo se permiten números'),
  password: Yup.string()
    .required('La contraseña es necesaria')
    .min(8, 'Mínimo 8 caracteres'),
  confirmPassword: Yup.string()
    .required('Confirme su contraseña')
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),
});

function Register() {
  return (
    <Formik
      initialValues={{ name: '', surname: '', dni: '', password: '', confirmPassword: '' }}
      validationSchema={RegisterSchema}
      onSubmit={(values) => {
        console.log('Valores Enviados', values);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <ProgressSteps>
            <ProgressStep label="Datos Personales">
              <View style={styles.container}>
                <Text style={styles.label}>Nombre</Text>
                <View style={styles.dniContainer}>
                  <TextInput
                    placeholder="Ingrese su nombre"
                    style={styles.dniInput}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                  />
                </View>
                {touched.name && errors.name && (
                  <Text style={styles.error}>{errors.name}</Text>
                )}

                <Text style={styles.label}>Apellido</Text>
                <View style={styles.dniContainer}>
                  <TextInput
                    placeholder="Ingrese su apellido"
                    style={styles.dniInput}
                    onChangeText={handleChange('surname')}
                    onBlur={handleBlur('surname')}
                    value={values.surname}
                  />
                </View>
                {touched.surname && errors.surname && (
                  <Text style={styles.error}>{errors.surname}</Text>
                )}

                <Text style={styles.label}>DNI</Text>
                <View style={styles.dniContainer}>
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
              </View>
            </ProgressStep>

            <ProgressStep label="Contraseñas">
              <View style={styles.container}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Ingrese su contraseña"
                    style={styles.passwordInput}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={true}
                  />
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                <Text style={styles.label}>Confirmar contraseña</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Ingrese nuevamente su contraseña"
                    style={styles.passwordInput}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    secureTextEntry={true}
                  />
                </View>
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.error}>{errors.confirmPassword}</Text>
                )}
              </View>

                <View>
                    <TouchableOpacity style={styles.loginBtn} onPress={()=> handleSubmit()}>
                        <Text style={styles.loginText}>Register</Text>
                    </TouchableOpacity>

                </View>
            </ProgressStep>
        </ProgressSteps>
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
    fontWeight: '600',
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

export default Register;
