import Loading from "@/components/common/loading";
import PrimaryButton from "@/components/common/primaryButton";
import SelectedStyles from "@/components/stylesSelection/selectedStyles";
import StylesList from "@/components/stylesSelection/stylesList";
import { useStylesSelectionPageQuery } from "@/generated/graphql";
import { gql } from "@apollo/client";
import { router, useLocalSearchParams } from "expo-router";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StylesSelection = () => {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { data } = useStylesSelectionPageQuery({
    variables: {
      projectId,
    },
  });

  if (!data) return <Loading />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.whiteText, styles.header]}>Select Styles</Text>
      <StylesList
        availableStyles={data?.availableStyles?.nodes}
        availableProperties={data?.availableProperties?.nodes}
        projectId={projectId}
      />
      {data.currentUser?.project && (
        <SelectedStyles cart={data.currentUser.project} />
      )}
      <PrimaryButton
        text="Next"
        onPress={() => {
          router.push("/projectStack");
        }}
      />
    </SafeAreaView>
  );
};

export default StylesSelection;

const styles = StyleSheet.create({
  whiteText: {
    color: "white",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#14142B",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export const QUERY_STYLES_SELECTION_PAGE = gql`
  query StylesSelectionPage($projectId: ID!) {
    availableStyles {
      nodes {
        ...styleStyleSelectionCard
      }
    }
    availableProperties(propertyType: FOR_STYLE) {
      nodes {
        ...propertyStyleSelectionCard
      }
    }
    currentUser {
      id
      project(projectId: $projectId) {
        id
        ...cart
      }
    }
  }
`;

// on project
// ...projectStyleSelectionCard
//
