import { Text, View, StyleSheet, Alert, Animated } from "react-native";
import React, {useState, useContext} from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/Input';
import RegisterButtons from '@/components/registerButtons';
import axios, { AxiosError } from 'axios';
import { useUser } from "@/context/UserContext";

const steps = ['Datos', 'Contraseña']

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es necesario')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo se permiten letras y espacios'),
  surname: Yup.string()
    .required('El apellido es necesario')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo se permiten letras y espacios'),
  identityNumber: Yup.string()
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
  const { setUser } = useUser();


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
      const response = await axios.post('http://192.168.18.2:8080/api/auth/register', {
        name: values.name,
        surname: values.surname,
        identityNumber: values.identityNumber,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: "USER"
      });

      const { id, name, surname, identityNumber, role} = response.data
      setUser ({
        logged:true,
        id: id,
        name: name,
        surname: surname,
        identityNumber: identityNumber,
        role: role,
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
        console.log('Error general al hacer la solicitud:', error.message);
        Alert.alert('Error', `Error al hacer la solicitud: ${error.message}`);
      }
        
    }
  }

  return (
    <Formik
      initialValues={{ name: '', surname: '', identityNumber: '', password: '', confirmPassword: '' }}
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
                    <Input
                      placeholder="Ingrese su nombre"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                    />
                    {touched.name && errors.name && (
                      <Text style={styles.error}>{errors.name}</Text>
                    )}

                  <Text style={styles.label}>Apellido</Text>
                    <Input
                      placeholder="Ingrese su apellido"
                      value={values.surname}
                      onChangeText={handleChange('surname')}
                      onBlur={handleBlur('surname')}
                    />
                    {touched.surname && errors.surname && (
                      <Text style={styles.error}>{errors.surname}</Text>
                    )}

                  <Text style={styles.label}>DNI</Text>
                    <Input
                      placeholder="Ingrese su DNI"
                      value={values.identityNumber}          
                      onChangeText={handleChange('identityNumber')}
                      onBlur={handleBlur('identityNumber')}
                      keyboardType="numeric"
                    />
                    {touched.identityNumber && errors.identityNumber && (
                      <Text style={styles.error}>{errors.identityNumber}</Text>
                    )}
                  </View>
                )}

                {step === 1 && (
                  <View style={styles.containerForm}>
                    <Text style={styles.label}>Contraseña</Text>
                    <Input
                      placeholder="Ingrese su contraseña"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      secureTextEntry={true}
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.error}>{errors.password}</Text>
                    )}

                    <Text style={styles.label}>Confirmar contraseña</Text>
                    <Input
                      placeholder="Ingrese nuevamente su contraseña"
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      secureTextEntry={true}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.error}>{errors.confirmPassword}</Text>
                    )}
                  </View>
                )}
                </View>

                <RegisterButtons
                  step={step}
                  maxSteps={steps.length}
                  onNext={() => {
                    setStep(step + 1);
                    animateLine();
                  }}
                  onBack={() => {
                    setStep(step - 1);
                    reverseLine();
                  }}
                  onSubmit={handleSubmit}
                />
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
