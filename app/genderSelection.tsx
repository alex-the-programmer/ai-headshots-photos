import IntoCard from "@/components/common/intoCard";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GenderSelection = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.whiteText, styles.header]}>
        Please choose the gender of the generated images
      </Text>
      <View style={styles.buttonContainer}>
        <IntoCard onPress={() => {}} thumbnails={[]}>
          <Text style={styles.buttonText}>Female</Text>
        </IntoCard>
        <IntoCard onPress={() => {}} thumbnails={[]}>
          <Text style={styles.buttonText}>Male</Text>
        </IntoCard>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#14142B",
  },
  whiteText: {
    color: "white",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    flex: 1,
    width: "100%",
    gap: 20,
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    flex: 1,
    borderRadius: 4,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 32,
    fontWeight: "600",
  },
});

export default GenderSelection;
