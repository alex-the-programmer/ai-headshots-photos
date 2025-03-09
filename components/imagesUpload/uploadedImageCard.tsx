import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Modal,
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
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleDelete = async () => {
    await removeImage({ variables: { imageId: imageId } });
    setModalVisible(false);
  };

  const hasError =
    status === ImageProcessingStatusEnum.NoFacesDetected ||
    status === ImageProcessingStatusEnum.MultipleFacesDetected;

  const getErrorMessage = () => {
    if (status === ImageProcessingStatusEnum.NoFacesDetected) {
      return "No faces were detected in this image. Please upload a clear photo of a single person.";
    }
    return "Multiple faces were detected in this image. Please upload a photo with only one person.";
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      {hasError && (
        <TouchableOpacity
          style={styles.warningOverlay}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="warning" size={32} color="#FFD700" />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.deleteText}>Delete Image</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning" size={32} color="#FFD700" />
              <Text style={styles.modalTitle}>Warning</Text>
            </View>
            <Text style={styles.modalMessage}>{getErrorMessage()}</Text>
            <TouchableOpacity
              style={styles.modalDeleteButton}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.modalDeleteText}>Delete Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  warningOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 20,
    width: screenWidth - 40,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  modalMessage: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  modalDeleteButton: {
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  modalDeleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
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
