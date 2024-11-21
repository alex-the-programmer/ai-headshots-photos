import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import UploadedImageCard from "./uploadedImageCard";

const { width: screenWidth } = Dimensions.get("window");
const imageWidth = (screenWidth - 60) / 2;

interface Image {
  id: string;
  uri: string;
}

interface UploadedImagesProps {
  images: Image[];
}

const UploadedImages = ({ images }: UploadedImagesProps) => {
  const renderItem = ({ item }: { item: Image }) => (
    <UploadedImageCard imageUri={item.uri} onDelete={() => {}} />
  );

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      style={styles.imageList}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  imageList: {
    width: "100%",
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default UploadedImages;
