import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import UploadImageButton from "@/components/imagesUpload/uploadImageButton";
import UploadedImages from "@/components/imagesUpload/uploadedImages";
import PrimaryButton from "@/components/common/primaryButton";
import { useRouter } from "expo-router";
const ImagesUpload = () => {
  const images = [
    { id: "1", uri: "https://picsum.photos/200/300" },
    { id: "2", uri: "https://picsum.photos/200/300" },
    { id: "3", uri: "https://picsum.photos/200/300" },
    { id: "4", uri: "https://picsum.photos/200/300" },
    { id: "5", uri: "https://picsum.photos/200/300" },
    { id: "6", uri: "https://picsum.photos/200/300" },
    { id: "7", uri: "https://picsum.photos/200/300" },
    { id: "8", uri: "https://picsum.photos/200/300" },
  ];

  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create AI Avatar</Text>
          <Text style={styles.subtitle}>
            Transform your imagination into art with our prompt generator
            feature. Experience the magic with free attempts.
          </Text>
        </View>

        <UploadImageButton freeTriesCount={3} />
        <UploadedImages images={images} />
        <View style={styles.buttonContainer}>
          <PrimaryButton
            text="Next"
            onPress={() => {
              router.push("/dashboard");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a1b2e",
  },
  container: {
    flex: 1,
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
  buttonContainer: {
    width: "100%",
  },
});

export default ImagesUpload;
