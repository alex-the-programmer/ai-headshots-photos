import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gql } from "@apollo/client";
import {
  ImageProcessingStatusEnum,
  useRemoveImageMutation,
} from "@/generated/graphql";

interface UploadedImageCardProps {
  imageUri: string;
  imageId: string;
  status: ImageProcessingStatusEnum;
}

const { width: screenWidth } = Dimensions.get("window");
const imageWidth = (screenWidth - 60) / 2;

const UploadedImageCard = ({
  imageUri,
  imageId,
  status,
}: UploadedImageCardProps) => {
  const [removeImage] = useRemoveImageMutation();

  const handleDelete = async () => {
    await removeImage({ variables: { imageId: imageId } });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.deleteText}>Delete Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: imageWidth,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a2e",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  deleteButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 12,
  },
});

export default UploadedImageCard;

export const REMOVE_IMAGE_MUTATION = gql`
  mutation RemoveImage($imageId: ID!) {
    removeProjectImage(input: { imageId: $imageId }) {
      project {
        ...projectUploadImagePage
      }
    }
  }
`;
