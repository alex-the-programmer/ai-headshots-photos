import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";
type PickerProp = {
  name: string;
  value: string;
};
const CustomPicker = (
  options: PickerProp[],
  selectedValue: string,
  onValueChange: (itemValue: string) => void
) => {
  return (
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={styles.picker}
    >
      {options.map((option) => (
        <Picker.Item label={option.name} value={option.value} />
      ))}
    </Picker>
  );
};

export default CustomPicker;

const styles = StyleSheet.create({
  picker: {
    minWidth: 200,
    width: "100%",
    height: 50,
  },
});
