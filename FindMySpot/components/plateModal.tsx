import React from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Buttons from './buttons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import apiClient from '@/api/apiClient';
import { saveToken } from '@/services/storage';
import { AxiosError } from 'axios';
import { router } from 'expo-router';

const plateRegex = /^[A-Z]{3} [0-9]{3}$|^[A-Z]{2} [0-9]{3} [A-Z]{2}$/;

const validationSchema = Yup.object().shape({
  plate: Yup.string()
    .required('La patente es obligatoria')
    .matches(
      plateRegex,
      'Formato inválido. Usa mayúsculas y espacios: ABC 123 o AB 123 CD'
    ),
});

const formatPlate = (text) => {
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
    const response = await apiClient.post('/api/auth/plates', {
      plate: values.plate
    });

    const { token } = response.data;
    await saveToken(token);

    if (response.status === 200) {
      resetForm();
      onClose();
      router.replace("/screens/mysCars");
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

const PlateModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Ingresa el número de patente</Text>

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
                    styles.input,
                    touched.plate && errors.plate ? styles.inputError : null,
                  ]}
                  value={values.plate}
                  onChangeText={(text) => {
                    const formatted = formatPlate(text);
                    setFieldValue('plate', formatted);
                  }}
                  placeholder="Ej: XYZ 123 o XY 123 ZA"
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
    margin: 20,
    padding: 20,
    backgroundColor: '#1a1a19',
    borderRadius: 12,
    elevation: 5,
    display: 'flex'
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'arial',
    fontWeight: 600,
    color: '#43985b'
  },
  error: {
    color: '#ff4d4d',
    marginBottom: 10,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    color: 'white'
  },
  buttons: {
    width: 290,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15
}

});

export default PlateModal;
