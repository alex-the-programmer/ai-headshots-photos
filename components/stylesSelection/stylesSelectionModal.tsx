import { Style } from "@/app/projectStack";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import PrimaryButton from "../common/primaryButton";

interface StylesSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  style: Style | null;
}

const StylesSelectionModal = ({
  visible,
  onClose,
  style,
}: StylesSelectionModalProps) => {
  const [selectedOutfit, setSelectedOutfit] = useState("Suit");
  const [selectedColor, setSelectedColor] = useState("Green");
  const [showOutfitPicker, setShowOutfitPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!style) return null;

  const renderPicker = Platform.select({
    ios: (
      <>
        <Pressable
          style={styles.iosPickerButton}
          onPress={() => setShowOutfitPicker(true)}
        >
          <Text style={styles.iosPickerButtonText}>{selectedOutfit}</Text>
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showOutfitPicker}
        >
          <View style={styles.iosPickerModal}>
            <View style={styles.iosPickerHeader}>
              <Pressable onPress={() => setShowOutfitPicker(false)}>
                <Text style={styles.iosPickerDoneText}>Done</Text>
              </Pressable>
            </View>
            <Picker
              selectedValue={selectedOutfit}
              onValueChange={(itemValue) => setSelectedOutfit(itemValue)}
              style={styles.iosPicker}
            >
              <Picker.Item label="Suit" value="Suit" />
              <Picker.Item label="Sweater" value="Sweater" />
              <Picker.Item label="Shirt" value="Shirt" />
            </Picker>
          </View>
        </Modal>
      </>
    ),
    android: (
      <Picker
        selectedValue={selectedOutfit}
        onValueChange={(itemValue) => setSelectedOutfit(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Suit" value="Suit" />
        <Picker.Item label="Sweater" value="Sweater" />
        <Picker.Item label="Shirt" value="Shirt" />
      </Picker>
    ),
  });

  const renderColorPicker = Platform.select({
    ios: (
      <>
        <Pressable
          style={styles.iosPickerButton}
          onPress={() => setShowColorPicker(true)}
        >
          <Text style={styles.iosPickerButtonText}>{selectedColor}</Text>
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showColorPicker}
        >
          <View style={styles.iosPickerModal}>
            <View style={styles.iosPickerHeader}>
              <Pressable onPress={() => setShowColorPicker(false)}>
                <Text style={styles.iosPickerDoneText}>Done</Text>
              </Pressable>
            </View>
            <Picker
              selectedValue={selectedColor}
              onValueChange={(itemValue) => setSelectedColor(itemValue)}
              style={styles.iosPicker}
            >
              <Picker.Item label="Green" value="Green" />
              <Picker.Item label="Blue" value="Blue" />
              <Picker.Item label="White" value="White" />
            </Picker>
          </View>
        </Modal>
      </>
    ),
    android: (
      <Picker
        selectedValue={selectedColor}
        onValueChange={(itemValue) => setSelectedColor(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Green" value="Green" />
        <Picker.Item label="Blue" value="Blue" />
        <Picker.Item label="White" value="White" />
      </Picker>
    ),
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{style.name}</Text>

          <Text style={styles.labelText}>Outfit</Text>
          <View style={styles.pickerContainer}>{renderPicker}</View>

          <Text style={styles.labelText}>Outfit Color</Text>
          <View style={styles.pickerContainer}>{renderColorPicker}</View>

          <PrimaryButton text="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  picker: {
    minWidth: 200,
    width: "100%",
    height: 50,
  },
  labelText: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  iosPickerButton: {
    width: "100%",
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  iosPickerButtonText: {
    fontSize: 16,
    color: "#000",
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
  iosPickerDoneText: {
    color: "#007AFF",
    fontSize: 17,
  },
  iosPicker: {
    width: "100%",
    height: 215,
  },
});

export default StylesSelectionModal;
