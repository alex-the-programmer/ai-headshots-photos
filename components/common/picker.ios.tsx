import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Pressable } from "react-native";

import { View } from "react-native";

import { Modal, Text, StyleSheet } from "react-native";

type PickerProp = {
  name: string;
  value: string;
};

type CustomPickerProps = {
  options: PickerProp[];
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
};

const CustomPicker = ({
  options,
  selectedValue,
  onValueChange,
}: CustomPickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <>
      <Pressable
        style={styles.iosPickerButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.iosPickerButtonText}>
          {options.find((option) => option.value === selectedValue)?.name ||
            selectedValue}
        </Text>
      </Pressable>
      <Modal animationType="slide" transparent={true} visible={showPicker}>
        <View style={styles.iosPickerModal}>
          <View style={styles.iosPickerHeader}>
            <Pressable onPress={() => setShowPicker(false)}>
              <Text style={styles.iosPickerDoneText}>Done</Text>
            </Pressable>
          </View>
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={styles.iosPicker}
          >
            {options.map((option) => (
              <Picker.Item
                label={option.name}
                value={option.value}
                key={option.value}
              />
            ))}
          </Picker>
        </View>
      </Modal>
    </>
  );
};

export default CustomPicker;

const styles = StyleSheet.create({
  iosPickerButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  iosPickerButtonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  iosPickerModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  iosPickerHeader: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    backgroundColor: "#f8f8f8",
    alignItems: "flex-end",
  },
  iosPicker: {
    width: "100%",
    height: 215,
  },
  iosPickerDoneText: {
    color: "#007AFF",
    fontSize: 17,
  },
});
