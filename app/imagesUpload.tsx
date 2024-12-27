import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import UploadImageButton from "@/components/imagesUpload/uploadImageButton";
import UploadedImages from "@/components/imagesUpload/uploadedImages";
import PrimaryButton from "@/components/common/primaryButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { gql } from "@apollo/client";
import { useImagesUploadPageQuery } from "@/generated/graphql";
const ImagesUpload = () => {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { data: imagesUploadPageData } = useImagesUploadPageQuery({
    variables: {
      projectId: projectId,
      correctionMode: false,
    },
  });

  const router = useRouter();
  const numberOfImages =
    imagesUploadPageData?.currentUser?.project?.inputImages?.nodes?.length ?? 0;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create AI Avatar</Text>
          <Text style={styles.subtitle}>
            Transform your imagination into art with our prompt generator
            feature. Experience the magic with free attempts.
          </Text>
        </View>

        <UploadImageButton />
        <UploadedImages
          images={
            imagesUploadPageData?.currentUser?.project?.inputImages?.nodes ?? []
          }
        />
        <View style={styles.buttonContainer}>
          {numberOfImages > 0 && numberOfImages < 10 && (
            <Text style={styles.warningText}>
              Please upload at least 10 photos
            </Text>
          )}
          <PrimaryButton
            text="Next"
            disabled={numberOfImages <= 10}
            onPress={() => {
              router.push("/stylesSelection");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a1b2e",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#8e8ea0",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  warningText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginBottom: 10,
  },
});

export default ImagesUpload;

export const QUERY_IMAGES_UPLOAD_PAGE = gql`
  query ImagesUploadPage($correctionMode: Boolean!, $projectId: ID!) {
    currentUser {
      id
      project(projectId: $projectId) {
        id
        hasInvalidImages @include(if: $correctionMode)
        hasImageProcessingErrors @include(if: $correctionMode)
        styles {
          nodes {
            id
          }
        }
        inputImages {
          nodes {
            ...inputImageUploadImagePage
          }
        }
      }
    }
  }
`;

export const FRAGMENT_PROJECT_UPLOAD_IMAGE_PAGE = gql`
  fragment projectUploadImagePage on Project {
    id
    inputImages {
      nodes {
        ...inputImageUploadImagePage
      }
    }
  }
`;

export const FRAGMENT_INPUT_IMAGE_UPLOAD_IMAGE_PAGE = gql`
  fragment inputImageUploadImagePage on InputImage {
    id
    url
    processingStatus
  }
`;
