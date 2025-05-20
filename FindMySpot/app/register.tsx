import { Text, View, StyleSheet, TextInput, Alert, TouchableOpacity, Animated } from "react-native";
import React, {useState} from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios, { AxiosError } from 'axios';

const steps = ['Datos', 'Contraseña']

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es necesario')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo se permiten letras y espacios'),
  surname: Yup.string()
    .required('El apellido es necesario')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo se permiten letras y espacios'),
  identity_number: Yup.string()
    .required('El DNI es necesario')
    .matches(/^\d{8}$/, 'Solo se permiten números')
    .min(8, 'Minimo 8 caracteres'),
  password: Yup.string()
    .required('La contraseña es necesaria')
    .min(8, 'Mínimo 8 caracteres'),
  confirmPassword: Yup.string()
    .required('Confirme su contraseña')
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),
});

function Register() {

  const [step, setStep] = useState(0);
  const [lineAnim] = useState(new Animated.Value(0));

  const animateLine = () => {
    Animated.timing(lineAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const reverseLine = () => {
    Animated.timing(lineAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };


  const handleRegister = async (values) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        name: values.name,
        surname: values.surname,
        identity_number: values.identity_number,
        password: values.password,
        role: "USER"
      });

      if (response.status === 201) {
        console.log('Registro exitoso')
        Alert.alert('Registro exitoso')
      }
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        console.log('Error', error.response.data || "Hubo un error al registrar al usuario")
        Alert.alert('Error', error.response.data as string || "Hubo un error al registrar al usuario")
      } else {
        Alert.alert('Error', "No se pudo conectar con el servidor.")
      }
        
    }
  }

  return (
    <Formik
      initialValues={{ name: '', surname: '', identity_number: '', password: '', confirmPassword: '' }}
      validationSchema={RegisterSchema}
      onSubmit={(values) => {
        handleRegister(values);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.container}>
                <View style={styles.stepsRow}>
                  <View style={styles.stepContainer}>
                    <View style={[styles.stepCircle, step === 0 && styles.activeStep]}>
                      <Text style={{ color: step === 0 ? 'white' : '#999' }}>1</Text>
                    </View>
                    <Text style={styles.stepLabel}>Datos</Text>
                  </View>
                  <View style={styles.stepLineContainer}>
                    <View style={styles.stepLineBackground} />
                    <Animated.View
                      style={[
                        styles.stepLineForeground,
                        {
                          width: lineAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 150],
                          }),
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.stepContainer}>
                    <View style={[styles.stepCircle, step === 1 && styles.activeStep]}>
                      <Text style={{ color: step === 1 ? 'white' : '#999' }}>2</Text>
                    </View>
                    <Text style={styles.stepLabel}>Contraseña</Text>
                  </View>
                </View>
                <View style={styles.content}>
                {step === 0 && (
                  <View style={styles.containerForm}>
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
                      onChangeText={handleChange('identity_number')}
                      onBlur={handleBlur('identity_number')}
                      value={values.identity_number}
                      keyboardType="numeric"
                    />
                  </View>
                  {touched.identity_number && errors.identity_number && (
                    <Text style={styles.error}>{errors.identity_number}</Text>
                  )}
                  </View>
                )}

                {step === 1 && (
                  <View style={styles.containerForm}>
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
                )}
                </View>

                <View style={styles.buttons}>
                  {step > 0 && (
                    <TouchableOpacity style={styles.loginBtn} onPress={() => {setStep(step - 1); reverseLine();}}>
                      <Text style={styles.loginText}>Atras</Text>
                    </TouchableOpacity>
                  )}
                  {step < steps.length - 1 ? (
                    <TouchableOpacity style={[styles.loginBtn, {marginLeft: 170}]} onPress={() => {setStep(step + 1); animateLine()}}>
                      <Text style={styles.loginText}>Siguiente</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.loginBtn} onPress={() => handleSubmit()}>
                      <Text style={styles.loginText}>Registrarse</Text>
                    </TouchableOpacity>
                  )}

                </View>
            </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  containerForm: {
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
  loginBtn: {
    marginTop: 20,
    backgroundColor: '#151717',
    borderRadius: 10,
    height: 50,
    width: "40%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  activeStep: {
    backgroundColor: 'black',
    borderColor: 'black'
  },
  stepLabel: {
    fontSize: 12,
    color: '#555',
    width: 70,
    textAlign: 'center'
  },
  buttons: {
    bottom: 20,
    left: 0,
    right:0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    gap: 15
  },
  stepLine: {
    height: 2,
    width: 0,
    marginBottom: 16,
    marginHorizontal: 5,
    alignSelf: 'center',
    backgroundColor: '#ccc',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  stepLineContainer: {
    height: 2,
    width: 150,
    backgroundColor: '#ccc',
    overflow: 'hidden',
    marginHorizontal: 5,
    marginBottom: 16,
    position: 'relative',
  },

  stepLineBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ccc',
  },

  stepLineForeground: {
    height: 2,
    backgroundColor: '#000',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  content: {
   flex: 1,
   justifyContent: 'flex-start' 
  }

});

export default Register;
