import IntoCard from "@/components/common/intoCard";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "./projectStack";

type Project = {
  id: string;
  createdAt: string;
  status: string;
  thumbnails: string[];
};

const projectsSample: Project[] = [
  {
    id: "1",
    createdAt: "2021-01-01",
    status: "pending",
    thumbnails: [
      "https://picsum.photos/150/150",
      "https://picsum.photos/150/150",
    ],
  },
  {
    id: "2",
    createdAt: "2021-01-02",
    status: "pending",
    thumbnails: [
      "https://picsum.photos/150/150",
      "https://picsum.photos/150/150",
    ],
  },
  {
    id: "3",
    createdAt: "2021-01-03",
    status: "pending",
    thumbnails: [
      "https://picsum.photos/150/150",
      "https://picsum.photos/150/150",
    ],
  },
  {
    id: "4",
    createdAt: "2021-01-04",
    status: "pending",
    thumbnails: [
      "https://picsum.photos/150/150",
      "https://picsum.photos/150/150",
    ],
  },
  {
    id: "5",
    createdAt: "2021-01-05",
    status: "pending",
    thumbnails: [
      "https://picsum.photos/150/150",
      "https://picsum.photos/150/150",
    ],
  },
  {
    id: "6",
    createdAt: "2021-01-06",
    status: "pending",
    thumbnails: [
      "https://picsum.photos/150/150",
      "https://picsum.photos/150/150",
    ],
  },
];

type ProjectsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define the props for the ProjectsListScreen using NativeStackScreenProps
type ProjectsListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Projects"
>;

const ProjectCard = ({
  project,
  navigation,
}: {
  project: Project;
  navigation: ProjectsNavigationProp;
}) => {
  const handlePress = () => {
    console.log("navigation before navigating ", navigation);
    navigation.navigate("Styles", {
      projectId: "1",
    });
  };

  return (
    <IntoCard onPress={handlePress} thumbnails={project.thumbnails}>
      <Text style={styles.whiteText}>{project.createdAt}</Text>
      <Text style={styles.whiteText}>{project.status}</Text>
    </IntoCard>
  );
};

const ProjectsList = ({
  projects,
  navigation,
}: {
  projects: Project[];
  navigation: ProjectsNavigationProp;
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FlatList
          data={projects}
          renderItem={({ item }) => (
            <ProjectCard project={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default function ProjectsListScreen({
  navigation,
}: ProjectsListScreenProps) {
  console.log("navigation", navigation);
  return <ProjectsList projects={projectsSample} navigation={navigation} />;
}

const styles = StyleSheet.create({
  whiteText: {
    color: "white",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#14142B",
  },
});
