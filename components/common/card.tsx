import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import type { StyleProp } from "react-native";

const Card = ({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <TouchableOpacity style={[styles.planCard, style ?? {}]} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: "#2a2a40",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
  },
});
