import { TouchableOpacity, Text, StyleSheet } from "react-native";

const PrimaryButton = ({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#7c3aed",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
