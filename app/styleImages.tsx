import { View, Text, FlatList, StyleSheet, Image } from "react-native";

const StyleImagesScreen = ({ route }) => {
  const { style } = route.params;

  return (
    <View style={styles.container}>
      <FlatList
        data={style.images}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
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
