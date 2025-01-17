import { TouchableOpacity, StyleSheet, ViewStyle, View } from "react-native";
import type { StyleProp } from "react-native";

const Card = ({
  children,
  onPress,
  style,
  disabled,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) => {
  if (disabled) {
    return <View style={[styles.planCard, style ?? {}]}>{children}</View>;
  }
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
