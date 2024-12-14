import { TouchableOpacity, Text, StyleSheet } from "react-native";

const PrimaryButton = ({
  text,
  onPress,
  disabled,
}: {
  text: string;
  onPress: () => void;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={disabled ? () => {} : onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
        {text}
      </Text>
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
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextDisabled: {
    color: "#e5e7eb",
  },
});
