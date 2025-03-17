import { View, FlatList, StyleSheet, Text } from "react-native";
import { Style } from "./projectStack";
import StyleCard from "@/components/dashboard/styleCard";
import { useRoute, RouteProp } from "@react-navigation/native";
import { gql } from "@apollo/client";
import Loading from "@/components/common/loading";
import {
  DashboardStylesFragment,
  useDashboardStylesQuery,
} from "@/generated/graphql";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  StyleImages: {
    style: DashboardStylesFragment;
  };
  Styles: {
    projectId: string;
  };
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const DashboardStyles = ({ navigation }: Props) => {
  const route = useRoute<RouteProp<RootStackParamList, "Styles">>();
  const projectId = route.params.projectId;

  console.log("Loading dashboard styles for projectId:", projectId);
  
  const { data: dashboardStylesData, loading, error } = useDashboardStylesQuery({
    variables: { projectId },
    onError: (error) => {
      console.error("Error loading dashboard styles:", error);
      // Check if it's an authentication error
      if (error.message.includes('authentication') || 
          error.message.includes('unauthorized') ||
          error.message.includes('jwt')) {
        // Handle authentication error
        AsyncStorage.getItem("session").then((session) => {
          console.log("Session data during error:", session);
        });
      }
    }
  });

  const renderStyleItem = ({ item }: { item: DashboardStylesFragment }) => (
    <StyleCard
      style={item}
      onPress={() => {
        console.log("Navigating to StyleImages for style:", item.id);
        navigation.navigate("StyleImages", { style: item });
      }}
    />
  );

  if (loading) return <Loading />;
  
  if (error) {
    console.error("Error in DashboardStyles:", error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error loading styles. Please try again later.
        </Text>
      </View>
    );
  }
  
  const projectStyles = dashboardStylesData?.currentUser?.project?.projectStyles?.nodes || [];
  console.log("Loaded styles count:", projectStyles.length);

  return (
    <View style={styles.container}>
      <FlatList
        data={projectStyles}
        renderItem={renderStyleItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No styles found for this project.</Text>
        )}
      />
    </View>
  );
};

export default DashboardStyles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#14142B",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 16,
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    marginTop: 16,
  },
});

const QUERY_DASHBOARD_STYLES = gql`
  query DashboardStyles($projectId: ID!) {
    currentUser {
      id
      project(projectId: $projectId) {
        id
        projectStyles {
          nodes {
            ...dashboardStyles
          }
        }
      }
    }
  }
`;
