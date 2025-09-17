import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet } from "react-native";
import { Plate } from "@/models/user"

interface PlatePickerProps {
    selectedPlateId: number | null;
    onPlateChange: (plateId: number | null) => void;
    plates: Plate[];
    borderColor?: string;
}


export default function PlatePicker({
        selectedPlateId, 
        onPlateChange, 
        plates,
        borderColor = "#43975a"
    }: PlatePickerProps) {
    return (
        <View style={[styles.picker, {borderColor}]}>
            <Picker
                selectedValue={selectedPlateId}
                onValueChange={(itemValue) => onPlateChange(itemValue)}
                style={{ marginLeft: '20%' }}
            >
                {plates.map((p) => (
                    <Picker.Item key={p.id} value={p.id} label={p.number} />
                ))}
            </Picker>
        </View>
    )
};

const styles = StyleSheet.create({
    picker: {
        borderColor: '#F44336',
        borderWidth: 1,
        borderRadius: 12,
        width: '50%',
        alignSelf: 'center',
        marginBottom: 50,
    },
});