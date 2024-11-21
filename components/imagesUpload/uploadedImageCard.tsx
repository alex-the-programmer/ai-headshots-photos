import { View, Image, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UploadedImageCardProps {
  imageUri: string;
  onDelete: () => void;
}

const UploadedImageCard = ({ imageUri, onDelete }: UploadedImageCardProps) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.deleteText}>Delete Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a2e",
    width: 250,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4B3F72",
    padding: 12,
    gap: 8,
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default UploadedImageCard;
