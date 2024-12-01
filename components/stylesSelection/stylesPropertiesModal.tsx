import React from "react";
import { Modal, View, Text, StyleSheet, Image } from "react-native";
import PrimaryButton from "../common/primaryButton";

interface StylesPropertiesModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: (styleId: string) => void;
  style: {
    id: string;
    name: string;
    imageUrl: string;
    outfit?: string;
    outfitColor?: string;
  } | null;
}

const StylesPropertiesModal = ({
  visible,
  onClose,
  onDelete,
  style,
}: StylesPropertiesModalProps) => {
  if (!style) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Style Properties</Text>

          <Image source={{ uri: style.imageUrl }} style={styles.previewImage} />

          <View style={styles.propertyContainer}>
            <Text style={styles.label}>Style name</Text>
            <Text style={styles.value}>{style.name}</Text>
          </View>

          <View style={styles.propertyContainer}>
            <Text style={styles.label}>Outfit</Text>
            <Text style={styles.value}>{style.outfit || "Not specified"}</Text>
          </View>

          <View style={styles.propertyContainer}>
            <Text style={styles.label}>Outfit Color</Text>
            <Text style={styles.value}>
              {style.outfitColor || "Not specified"}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton text="Back" onPress={onClose} />
            <PrimaryButton
              text="Delete"
              onPress={() => onDelete(style.id)}
              style={styles.deleteButton}
              textStyle={styles.deleteButtonText}
            />
          </View>
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
    width: "90%",
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  propertyContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  deleteButtonText: {
    color: "white",
  },
});

export default StylesPropertiesModal;
