import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();
  const handlePress = () => {
    // AsyncStorage.setItem("hasSeenWelcome", "true");
    // router.replace("/(tabs)");
    router.push("/payment");
  };

  return (
    <View style={styles.container}>
      {/* Grid of AI artwork examples */}
      <View style={styles.artworkGrid}>
        {/* You'll need to add your artwork images here */}
      </View>

      {/* Welcome Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Create your own masterpiece with AI</Text>
        <Text style={styles.subtitle}>
          Turn your ideas into AI powered artwork in seconds
        </Text>
      </View>

      {/* Start Creating Button */}
      <TouchableOpacity style={styles.button} onPress={() => handlePress()}>
        <Text style={styles.buttonText}>Start Creating ✨</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  artworkGrid: {
    flex: 1,
    // Add grid layout styling for the artwork examples
  },
  textContainer: {
    marginVertical: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 32,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
