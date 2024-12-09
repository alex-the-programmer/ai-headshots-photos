import { TouchableOpacity, Text, StyleSheet } from "react-native";

const SignInButtonInternal = ({ handlePress }: { handlePress: () => void }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={() => handlePress()}>
      <Text style={styles.buttonText}>Start Creating ✨</Text>
    </TouchableOpacity>
  );
};

export default SignInButtonInternal;

const styles = StyleSheet.create({
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
