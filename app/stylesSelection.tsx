import IntoCard from "@/components/common/intoCard";
import PrimaryButton from "@/components/common/primaryButton";
import SelectedStyles from "@/components/stylesSelection/selectedStyles";
import StylesList from "@/components/stylesSelection/stylesList";
import { router } from "expo-router";
import { FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StylesSelection = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.whiteText, styles.header]}>Select Styles</Text>
      <StylesList />
      <SelectedStyles />
      <PrimaryButton
        text="Next"
        onPress={() => {
          router.push("/projectStack");
        }}
      />
    </SafeAreaView>
  );
};

export default StylesSelection;

const styles = StyleSheet.create({
  whiteText: {
    color: "white",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#14142B",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
