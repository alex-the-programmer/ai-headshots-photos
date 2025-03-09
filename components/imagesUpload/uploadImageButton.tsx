import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gql } from "@apollo/client";
import { useUploadImageMutation } from "@/generated/graphql";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";

interface UploadImageButtonProps {
  projectId: string;
  onLoadingChange?: (loading: boolean) => void;
  refetch: () => void;
}

const UploadImageButton = ({
  onLoadingChange,
  refetch,
}: UploadImageButtonProps) => {
  const [uploadImage, { loading }] = useUploadImageMutation({
    onError: () => onLoadingChange?.(false),
  });
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const performUpload = async () => {
    try {
      onLoadingChange?.(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
        base64: false,
        exif: false,
      });

      console.log("Picker result:", result);

      if (!result.canceled && result.assets.length > 0) {
        for (const asset of result.assets) {
          try {
            const imageFile = {
              uri: asset.uri,
              type: "image/jpeg",
              name: `image-${Date.now()}.jpg`,
              size: asset.fileSize || 0,
              lastModified: Date.now(),
            };

            console.log("Uploading file:", imageFile);

            const response = await uploadImage({
              variables: {
                projectId,
                image: imageFile,
                triggerProcessing: true,
              },
              context: {
                headers: {
                  "Apollo-Require-Preflight": "true",
                  "Content-Type": "multipart/form-data",
                },
              },
            });

            console.log("Upload response:", response);
            await refetch();
          } catch (error) {
            console.error(`Failed to upload image:`, error);
          }
        }
      }
      onLoadingChange?.(false);
    } catch (error) {
      console.error(`Error picking images:`, error);
      onLoadingChange?.(false);
    }
  };

  return (
    <View style={styles.uploadSection}>
      <TouchableOpacity
        style={[styles.uploadButton, loading && styles.uploadButtonDisabled]}
        onPress={performUpload}
        disabled={loading}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.uploadText}>
        {loading ? "Uploading..." : "Upload Images"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadSection: {
    alignItems: "center",
  },
  uploadButton: {
    width: 120,
    height: 120,
    borderRadius: 22,
    backgroundColor: "#2a2b3e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#4a4b8c",
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 8,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadText: {
    color: "white",
    marginTop: 8,
    fontSize: 16,
  },
  freeTriesText: {
    color: "#8e8ea0",
    fontSize: 12,
    marginTop: 4,
  },
});

export default UploadImageButton;

export const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadImage(
    $projectId: ID!
    $image: Upload!
    $triggerProcessing: Boolean!
  ) {
    uploadProjectImage(
      input: {
        projectId: $projectId
        image: $image
        triggerProcessing: $triggerProcessing
      }
    ) {
      project {
        id
        ...projectUploadImagePage
      }
    }
  }
`;
