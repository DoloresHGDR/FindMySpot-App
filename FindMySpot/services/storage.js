import * as SecureStore from 'expo-secure-store';
import { Alert } from "react-native";
import { AppState } from 'react-native';

let rememberMe = false;
let tokenKey = 'auth_token';

export async function saveToken(token, remember = false) {
    try {
        rememberMe = remember
        await SecureStore.setItemAsync(tokenKey, token);
    } catch (error) {
        console.error('Error al guardar token seguro:', error);
    }
}

export async function getToken() {
    try {
        const token = await SecureStore.getItemAsync(tokenKey);
        return token;
    } catch (error) {
        Alert.alert('error leyendo token seguro:', error.message || 'Error')
        console.error('Error leyendo token seguro:', error);
        return null;
    }
}

export async function removeToken() {
    try {
        await SecureStore.deleteItemAsync(tokenKey);
    } catch (error) {
        console.error('Error al eliminar token seguro:', error)
    }
}

AppState.addEventListener('change', async (state) => {
  if (state === 'background' || state === 'inactive') {
    if (!rememberMe) {
      await removeToken();
    }
  }
});