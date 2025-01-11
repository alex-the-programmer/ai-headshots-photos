import { View, FlatList, StyleSheet } from "react-native";
import { Style } from "./projectStack";
import StyleCard from "@/components/dashboard/styleCard";
import { useLocalSearchParams } from "expo-router";
import { gql } from "@apollo/client";
import Loading from "@/components/common/loading";
import {
  DashboardStylesFragment,
  useDashboardStylesQuery,
} from "@/generated/graphql";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  StyleImages: {
    style: DashboardStylesFragment;
  };
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const DashboardStyles = ({ navigation }: Props) => {
  const renderStyleItem = ({ item }: { item: DashboardStylesFragment }) => (
    <StyleCard
      style={item}
      onPress={() => navigation.navigate("StyleImages", { style: item })}
    />
  );

  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { data: dashboardStylesData, loading } = useDashboardStylesQuery({
    variables: { projectId },
  });

  if (loading) return <Loading />;

  return (
    <View style={styles.container}>
      <FlatList
        data={dashboardStylesData?.currentUser?.project?.projectStyles?.nodes}
        renderItem={renderStyleItem}
        keyExtractor={(item) => item.id}
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
