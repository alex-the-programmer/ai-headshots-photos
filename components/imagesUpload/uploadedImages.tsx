import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import UploadedImageCard from "./uploadedImageCard";
import { InputImageUploadImagePageFragment } from "@/generated/graphql";

const { width: screenWidth } = Dimensions.get("window");
const imageWidth = (screenWidth - 60) / 2;

interface UploadedImagesProps {
  images: InputImageUploadImagePageFragment[];
}

const UploadedImages = ({ images }: UploadedImagesProps) => {
  const renderItem = ({
    item,
  }: {
    item: InputImageUploadImagePageFragment;
  }) => <UploadedImageCard imageUri={item.url} onDelete={() => {}} />;

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
