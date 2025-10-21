import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { updateBalance } from '@/services/remote/balance/balanceService';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useUser } from '@/services/remote/queries/user/useUserQuery';

interface RechargeModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const RechargeModal: React.FC<RechargeModalProps> = ({ visible, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { refetch } = useUser();

  const handleConfirm = async () => {
    const numeric = Number(amount);
    if (!numeric || numeric <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido');
      return;
    }
    try {
      setLoading(true);
      await updateBalance(numeric);
      setLoading(false);

      if (typeof refetch === 'function') {
        try {
          await refetch();
        } catch (err) {
          console.warn('refetch user failed, invalidando query', err);
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
        }
      } else {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
      }

      Alert.alert('Éxito', 'Saldo recargado correctamente');
      setAmount('');
      onClose();
      onSuccess?.();
    } catch (err) {
      setLoading(false);
      console.error('topUpBalance error', err);
      Alert.alert('Error', 'No se pudo recargar el saldo. Intenta nuevamente.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Recargar saldo</Text>
          <Text style={styles.label}>Monto a recargar</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
            style={styles.input}
            editable={!loading}
          />
          <View style={styles.actions}>
            <Pressable
              style={[styles.btn, styles.cancel]}
              onPress={() => { if (!loading) { setAmount(''); onClose(); } }}
            >
              <Text style={[styles.btnText, { color: '#000' }]}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.confirm]}
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Aceptar</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    backdrop: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    container: { 
        width: '85%', 
        backgroundColor: '#1a1a19',
        borderColor: "#43975a",
        borderWidth: 2, 
        borderRadius: 8, 
        padding: 16 
    },
    title: { 
        fontSize: 18, 
        fontWeight: '700', 
        marginBottom: 8,
        color: '#e9e9e9'
    },
    label: { 
        fontSize: 14, 
        marginBottom: 6,
        color: '#e9e9e9'
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        padding: 10, 
        borderRadius: 6, 
        marginBottom: 12 
    },
    actions: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        paddingTop: 10
    },
    btn: { 
        paddingVertical: 10, 
        paddingHorizontal: 16, 
        borderRadius: 6, 
        minWidth: 90, 
        alignItems: 'center' 
    },
    cancel: { 
        backgroundColor: '#e0e0e0', 
        left: 115
    },
    confirm: { 
        backgroundColor: '#43975a',
        right: 115 
    },
    btnText: { 
        color: '#fff', 
        fontWeight: '600' 
    },
});

export default RechargeModal;