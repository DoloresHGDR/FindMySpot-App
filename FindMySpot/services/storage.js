import * as SecureStore from 'expo-secure-store';
import { Alert } from "react-native";

export async function saveToken(token) {
    try {
        await SecureStore.setItemAsync('auth_token', token);
    } catch (error) {
        console.error('Error al guardar token seguro:', error);
    }
}

export async function getToken() {
    try {
        const token = await SecureStore.getItemAsync('auth_token');
        return token;
    } catch (error) {
        Alert.alert('error leyendo token seguro:', error.message || 'Error')
        console.error('Error leyendo token seguro:', error);
        return null;
    }
}

export async function removeToken() {
    try {
        await SecureStore.deleteItemAsync('auth_token');
    } catch (error) {
        console.error('Error al eliminar token seguro:', error)
    }
}