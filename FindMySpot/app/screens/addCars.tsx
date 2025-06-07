import { Text, View, StyleSheet, Alert, Button } from "react-native";
import React from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/Input';
import axios, { AxiosError } from 'axios';


const CarSchema = Yup.object().shape({
    plate: Yup.string()
        .required('La matrícula es obligatoria')
        .matches(/^[A-Za-z0-9\s]+$/, 'Solo se permiten letras, números y espacios'),
    ownerName: Yup.string()
        .required('El nombre es obligatorio')
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo se permiten letras y espacios'),
    ownerSurname: Yup.string()
        .required('El apellido es obligatorio')
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, 'Solo se permiten letras y espacios'),
});

const AddCar = () => {
  const handleAddCar = async (values: any) => {
    try {
      const response = await axios.post('http://192.168.0.119:8080/api/aynose', {
        plate: values.plate(),
        ownerName: values.ownerName(),
        ownerSurname: values.ownerSurname()
      });
    
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
      initialValues={{ plate: '', ownerName: '', ownerSurname: '' }}
      validationSchema={CarSchema}
      onSubmit={(values) => {
            handleAddCar(values);
        }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.label}>Ingrese su Matrícula</Text>
          <Input
            placeholder="ABC123"
            value={values.plate}
            onChangeText={handleChange('plate')}
            onBlur={handleBlur('plate')}
          />
          {touched.plate && errors.plate && (
            <Text style={styles.error}>{errors.plate}</Text>
          )}

          <Text style={styles.label}>Nombre del dueño</Text>
          <Input
            placeholder="Tupu"
            value={values.ownerName}
            onChangeText={handleChange('ownerName')}
            onBlur={handleBlur('ownerName')}
          />
          {touched.ownerName && errors.ownerName && (
            <Text style={styles.error}>{errors.ownerName}</Text>
          )}

          <Text style={styles.label}>Apellido del dueño</Text>
          <Input
            placeholder="Tamadre"
            value={values.ownerSurname}
            onChangeText={handleChange('ownerSurname')}
            onBlur={handleBlur('ownerSurname')}
          />
          {touched.ownerSurname && errors.ownerSurname && (
            <Text style={styles.error}>{errors.ownerSurname}</Text>
          )}

          <Button title="Agregar" onPress={() => handleSubmit} />

        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
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
});

export default AddCar;
