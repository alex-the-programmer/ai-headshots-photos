import { View, Text, StyleSheet } from "react-native";
import UploadImageButton from "@/components/imagesUpload/uploadImageButton";
import UploadedImageCard from "@/components/imagesUpload/uploadedImageCard";

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

      <UploadImageButton freeTriesCount={3} />
      <UploadedImageCard
        imageUri="https://picsum.photos/200/300"
        onDelete={() => {}}
      />
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
});

export default ImagesUpload;
