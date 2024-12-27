import IntoCard from "@/components/common/intoCard";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "./projectStack";
import { gql } from "@apollo/client";
import ProjectCard from "@/components/projectsList/projectCard";
import { ProjectCardFragment, useProjectsListQuery } from "@/generated/graphql";
import Loading from "@/components/common/loading";

type Project = {
  id: string;
  createdAt: string;
  status: string;
  thumbnails: string[];
};

type ProjectsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define the props for the ProjectsListScreen using NativeStackScreenProps
type ProjectsListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Projects"
>;

const ProjectsList = ({
  projects,
  navigation,
}: {
  projects: ProjectCardFragment[];
  navigation: ProjectsNavigationProp;
}) => {
  const { data: projectsListData, loading } = useProjectsListQuery();
  if (loading) return <Loading />;
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FlatList
          data={projectsListData?.currentUser?.projects?.nodes}
          renderItem={({ item }) => (
            <ProjectCard project={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProjectsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#14142B",
  },
});

export const QUERY_PROJECTS_LIST = gql`
  query ProjectsList {
    currentUser {
      id
      projects {
        nodes {
          ...projectCard
        }
      }
    }
  }
`;
