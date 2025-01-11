import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DashboardStylesFragment } from "@/generated/graphql";

type RootStackParamList = {
  StyleImages: {
    style: DashboardStylesFragment;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, "StyleImages">;

const StyleImagesScreen = ({ route }: Props) => {
  const { style } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={style.generatedImages?.nodes}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.originalUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

export default StyleImagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#14142B",
  },
  imageContainer: {
    flex: 1,
    padding: 8,
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
});
