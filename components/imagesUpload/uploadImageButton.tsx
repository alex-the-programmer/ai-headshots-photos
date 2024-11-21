import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UploadImageButtonProps {
  freeTriesCount?: number;
}

const UploadImageButton = ({ freeTriesCount = 3 }: UploadImageButtonProps) => {
  return (
    <View style={styles.uploadSection}>
      <TouchableOpacity style={styles.uploadButton}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.uploadText}>Upload Image</Text>
      <Text style={styles.freeTriesText}>
        You have {freeTriesCount} free tries
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadSection: {
    alignItems: "center",
  },
  uploadButton: {
    width: 120,
    height: 120,
    borderRadius: 22,
    backgroundColor: "#2a2b3e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#4a4b8c",
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 8,
  },
  uploadText: {
    color: "white",
    marginTop: 8,
    fontSize: 16,
  },
  freeTriesText: {
    color: "#8e8ea0",
    fontSize: 12,
    marginTop: 4,
  },
});

export default UploadImageButton;
