import { View, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import { ImageCardFragment } from "@/generated/graphql";
import { gql } from "@apollo/client";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const ImageCard = ({ image }: { image: ImageCardFragment }) => {
  const handleDownload = async () => {
    try {
      // Request permission to save to media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to save images"
        );
        return;
      }

      // Download the image
      const filename = image.originalUrl.split("/").pop() || "download.jpg";
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        image.originalUrl,
        fileUri,
        {}
      );

      const result = await downloadResumable.downloadAsync();
      if (!result) {
        Alert.alert("Error", "Failed to download image");
        return;
      }

      const { uri } = result;

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(uri);

      Alert.alert("Success", "Image saved to your photos");
    } catch (error) {
      Alert.alert("Error", "Failed to download image");
      console.error(error);
    }
  };

  const handleLongPress = () => {
    Alert.alert("Image Options", "What would you like to do?", [
      {
        text: "Download",
        onPress: handleDownload,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity onLongPress={handleLongPress}>
        <Image
          source={{ uri: image.thumbnailUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
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
