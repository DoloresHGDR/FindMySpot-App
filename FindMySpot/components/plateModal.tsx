import React from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Buttons from './buttons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import apiClient from '@/api/apiClient';
import { AxiosError } from 'axios';
import { router } from 'expo-router';

const plateRegex = /^[A-Z]{3} [0-9]{3}$|^[A-Z]{2} [0-9]{3} [A-Z]{2}$/;

const validationSchema = Yup.object().shape({
  plate: Yup.string()
    .required('La patente es obligatoria')
    .matches(
      plateRegex,
      'Formato inválido.'
    ),
});

const formatPlate = (text: any) => {
  const cleaned = text.replace(/\s+/g, '').toUpperCase();
  if (cleaned.length <= 6 && /^[A-Z]{3}[0-9]{0,3}/.test(cleaned)) {
    return cleaned.length > 3
      ? `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
      : cleaned;
  } else if (cleaned.length <= 7) {
    if (cleaned.length > 5)
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    if (cleaned.length > 2)
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    return cleaned;
  } else {
    return cleaned;
  }
};

const handlePlates = async (values: any, onClose: () => void, resetForm: () => void) => {
  try {
    const response = await apiClient.post('/api/plates', {
      number: values.plate
    });

    if (response.status === 200) {
      resetForm();
      onClose();
      router.replace("/screens/plates");
    }
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
            console.log('Error', error.response.data || "Hubo un error al registrar la matricula")
            Alert.alert('Error', error.response.data as string || "Hubo un error al registrar la matricula")
          } else {
            console.log('Error general al hacer la solicitud:', error.message);
            Alert.alert('Error', `Error al hacer la solicitud: ${error.message}`);
          }
  }
};

const PlateModal = ({ visible, onClose } : any) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Matrícula</Text>

          <Formik
            initialValues={{ plate: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              handlePlates(values, onClose, resetForm);
            }}
          >
            {({ handleSubmit, values, errors, touched, setFieldValue, resetForm }) => (
              <>
                <TextInput
                  style={[
                    styles.input
                  ]}
                  value={values.plate}
                  onChangeText={(text) => {
                    const formatted = formatPlate(text);
                    setFieldValue('plate', formatted);
                  }}
                  placeholder="Ingrese una matrícula"
                  placeholderTextColor="#3f3f3cff"
                  autoCapitalize="characters"
                  maxLength={9}
                />

                {touched.plate && errors.plate && (
                  <Text style={styles.error}>{errors.plate}</Text>
                )}

                <View style={styles.buttons}>
                  <Buttons tittle="Añadir" onPress={handleSubmit} />
                  <Buttons
                    tittle="Cancelar"
                    onPress={() => {
                      resetForm();
                      onClose();
                    }}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000088'
  },
  container: {
    margin: 35,
    backgroundColor: '#1a1a19',
    borderRadius: 12,
    elevation: 5,
    width: '80%',
    height: '27%',
    justifyContent: 'center',
    padding: 25
  },
  title: {
    fontSize: 24,
    fontFamily: 'arial',
    fontWeight: 'bold',
    color: '#43985b',
    textAlign: 'center',
    top: -20
  },
  error: {
    color: '#ff4d4d',
    fontSize: 14,
    paddingLeft: 6
  },
  input: {
    borderWidth: 1,
    borderColor: '#cecece',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    color: 'white'
  },
  buttons: {
    width: '85%',
    height: 60,
    flexDirection: 'row',
    marginLeft: 6,
    gap: 30,
    bottom: -18,
}

});

export default PlateModal;
