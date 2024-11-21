import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Expo

const ImagesUpload = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create AI Avatar</Text>
        <Text style={styles.subtitle}>
          Transform your imagination into art with our prompt generator feature.
          Experience the magic with free attempts.
        </Text>
      </View>

      <TouchableOpacity style={styles.uploadButton}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.uploadText}>Upload Image</Text>
        <Text style={styles.freeTriesText}>You have 3 free tries</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1b2e",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#8e8ea0",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  uploadButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#2a2b3e",
    alignItems: "center",
    justifyContent: "center",
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

export default ImagesUpload;
