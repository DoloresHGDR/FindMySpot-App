import React, { useState } from 'react';
import 'react-native-get-random-values';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

interface ModalParkingProps {
  visible: boolean;
  onClose: () => void;
  plates: string[];
  onSubmit: (data: { plate: string; address: string; duration: string }) => void;
  googleApiKey: string;
}

interface FormData {
  plate: string;
  address: string;
  duration: string;
  height: string;
}

type AddressComponent = {
      long_name: string;
      short_name: string;
      types: string[];
    };

const schema = yup.object().shape({
  plate: yup.string().required('Selecciona una patente'),
  address: yup.string().required('La dirección no es valida'),
  height: yup.string()
    .required('La altura es obligatoria')
    .matches(/^\d+$/, 'La altura debe ser un número válido'),
  duration: yup.string()
    .required('La duración es obligatoria')
    .test('is-valid-duration', 'La duración mínima es de 10 minutos', value => {
      const parsed = parseInt(value || '', 10);
      return !isNaN(parsed) && parsed >= 10;
    }),
});

export const ModalParking: React.FC<ModalParkingProps> = ({ visible, onClose, plates, onSubmit, googleApiKey }) => {
  const [inputAddress, setInputAddress] = useState('');
  const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
      defaultValues: {
        plate: plates[0] || '',
        address: '',
        height: '',
        duration: '',
      },
  });

  const submitForm = (data: FormData) => {
    const fullAddress = `${data.address} ${data.height}`;
    onSubmit({ plate: data.plate, address: fullAddress, duration: data.duration });
    reset();
    setInputAddress('');
    onClose();
  };

  const validateLocation = (details: any) => {
    const components: AddressComponent[] = details?.address_components ?? [];

    const getComponent = (type: string) =>
      components.find(c => c.types.includes(type))?.long_name ?? '';

    const city = getComponent('locality');
    const departament = getComponent('administrative_area_level_2');
    const province = getComponent('administrative_area_level_1');
    const country = getComponent('country');

    const isSanRafael = (city === 'San Rafael' || departament === 'San Rafael') &&
      province === 'Mendoza' &&
      country === 'Argentina';

    return isSanRafael;
  };

  const handleAddressSelect = (data: any, details: any) => {
    if (!details) {
      Alert.alert('No se pudo obtener detalles de la dirección');
      return;
    }

    if (!validateLocation(details)) {
      Alert.alert('La dirección debe estar en San Rafael, Mendoza, Argentina');
      return;
    }

    const selectedAddress = details?.name || data.description || '';
    setValue('address', selectedAddress, { shouldValidate: true });
    setInputAddress(selectedAddress)
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior="height" style={styles.modal}>
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Patente</Text>
              <View style={styles.pickerWrapper}>
                <Controller
                  name="plate"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={styles.input}
                    >
                      {plates.map((plate, idx) => (
                        <Picker.Item key={idx} label={plate} value={plate} />
                      ))}
                    </Picker>
                  )}
                />
              </View>
              {errors.plate && <Text style={styles.error}>{errors.plate.message}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dirección (sin altura)</Text>
              {errors.address && <Text style={styles.error}>{errors.address.message}</Text>}
              <View style={styles.autocompleteWrapper}>
              <GooglePlacesAutocomplete
                placeholder="Search"
                onPress={handleAddressSelect}
                fetchDetails={true}
                query={{
                  key: 'AIzaSyAc9TkncKPp1e2woZfDIsDQNv-zrAFPqBs',
                  language: 'es',
                  location: '-34.617,-68.330',
                  components: 'country:ar',
                  radius: 5000,
                  strictbounds: true,
                  type: 'route',
                }}
                autoFillOnNotFound={false}
                currentLocation={false}
                currentLocationLabel="Current location"
                debounce={0}
                disableScroll={false}
                enableHighAccuracyLocation={true}
                enablePoweredByContainer={true}
                filterReverseGeocodingByTypes={[]}
                GooglePlacesDetailsQuery={{}}
                GooglePlacesSearchQuery={{
                  rankby: 'distance',
                  type: 'restaurant',
                }}
                GoogleReverseGeocodingQuery={{}}
                isRowScrollable={true}
                keyboardShouldPersistTaps="always"
                listUnderlayColor="#c8c7cc"
                listViewDisplayed="auto"
                keepResultsAfterBlur={false}
                minLength={1}
                nearbyPlacesAPI="GooglePlacesSearch"
                numberOfLines={1}
                onFail={() => {}}
                onNotFound={() => {}}
                onTimeout={() =>
                  console.warn('google places autocomplete: request timeout')
                }
                predefinedPlaces={[]}
                predefinedPlacesAlwaysVisible={false}
                styles={{
                  textInput: styles.textInput,
                  container: {
                    flex: 1,
                    zIndex: 5,
                  },
                  listView: {
                    zIndex: 0,
                    elevation: 1,
                    position: 'absolute',
                    top: 45,
                  },
                }}
                suppressDefaultStyles={false}
                textInputHide={false}
                textInputProps={{
                    value: inputAddress,
                    onChangeText: text => setInputAddress(text),
                    autoCorrect: false,
                    autoCapitalize: 'none',
                  }}
                timeout={20000}
              />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Altura</Text>
              <Controller
                name="height"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Ej: 123"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.height && <Text style={styles.error}>{errors.height.message}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Duración (minutos)</Text>
              <Controller
                name="duration"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Ej: 30"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.duration && <Text style={styles.error}>{errors.duration.message}</Text>}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleSubmit(submitForm)} style={styles.button}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '108%',
    padding: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 8,
    height: 45,
    justifyContent: 'center',
    paddingTop: 8,
  },
  content: {
    flexGrow: 1,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 16,
  },
  textInput: {
    height: 45,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  listView: {
    position: 'absolute',
    top: 60,
    zIndex: 1000,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  autocompleteWrapper: {
    height: 50,
},
});
