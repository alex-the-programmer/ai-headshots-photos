import IntoCard from "@/components/common/intoCard";
import Loading from "@/components/common/loading";
import {
  useGenderSelectorQuery,
  useUpdateProjectPropertyValueMutation,
} from "@/generated/graphql";
import { gql } from "@apollo/client";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GenderSelection = () => {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const { data: genderSelectorData } = useGenderSelectorQuery();
  const [updateProjectPropertyValue] = useUpdateProjectPropertyValueMutation();
  const router = useRouter();

  if (!genderSelectorData) {
    return <Loading />;
  }

  const selectGender = async (gender: string) => {
    const genderPropertyValue = genderSelectorData.availableProperties.nodes
      .find((property) => property.name === "Gender")
      ?.propertyValues.nodes.find((value) => value.name === gender);

    console.log("genderPropertyValue", genderSelectorData);

    await updateProjectPropertyValue({
      variables: {
        projectId: projectId,
        propertyValueId: genderPropertyValue?.id ?? "",
      },
    });

    router.push({
      pathname: "/imagesUpload",
      params: {
        projectId,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.whiteText, styles.header]}>
        Please choose the gender of the generated images
      </Text>
      <View style={styles.buttonContainer}>
        <IntoCard
          onPress={() => {
            selectGender("Female");
          }}
          thumbnails={[
            "../assets/images/genderSelection/femalePlaceholder.png",
          ]}
        >
          <Text style={styles.buttonText}>Female</Text>
        </IntoCard>
        <IntoCard
          onPress={() => selectGender("Male")}
          thumbnails={["../assets/images/genderSelection/malePlaceholder.png"]}
        >
          <Text style={styles.buttonText}>Male</Text>
        </IntoCard>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#14142B",
  },
  whiteText: {
    color: "white",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    flex: 1,
    width: "100%",
    gap: 20,
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    flex: 1,
    borderRadius: 4,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 32,
    fontWeight: "600",
  },
});

export default GenderSelection;

export const QUERY_GENDER_SELECTOR = gql`
  query GenderSelector {
    availableProperties(propertyType: FOR_PROJECT) {
      nodes {
        id
        name
        propertyValues {
          nodes {
            id
            name
          }
        }
      }
    }
  }
`;

export const UPDATE_PROJECT_PROPERTY_VALUE_MUTATION = gql`
  mutation UpdateProjectPropertyValue($projectId: ID!, $propertyValueId: ID!) {
    updateProjectPropertyValue(
      input: { projectId: $projectId, propertyValueId: $propertyValueId }
    ) {
      project {
        id
        genderPropertyValue {
          id
        }
      }
    }
  }
`;
