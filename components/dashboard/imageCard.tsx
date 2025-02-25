import { View, Image, StyleSheet } from "react-native";
import { ImageCardFragment } from "@/generated/graphql";
import { gql } from "@apollo/client";

const ImageCard = ({ image }: { image: ImageCardFragment }) => {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: image.thumbnailUrl }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    padding: 8,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
});

export default ImageCard;

const imageCardFragment = gql`
  fragment ImageCard on GeneratedImage {
    id
    thumbnailUrl
    originalUrl
  }
`;
