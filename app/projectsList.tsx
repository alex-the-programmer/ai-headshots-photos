import IntoCard from "@/components/common/intoCard";
import { useRouter } from "expo-router";
import { View, Text, FlatList, StyleSheet } from "react-native";

type Project = {
  id: string;
  createdAt: string;
  thumbnails: string[];
};

const projectsSample: Project[] = [
  {
    id: "1",
    createdAt: "2021-01-01",
    thumbnails: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
  },
  {
    id: "2",
    createdAt: "2021-01-02",
    thumbnails: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
  },
  {
    id: "3",
    createdAt: "2021-01-03",
    thumbnails: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
  },
];

const ProjectCard = ({ project }: { project: Project }) => {
  const router = useRouter();
  return (
    <IntoCard
      onPress={() => {
        router.push("/dashboard");
      }}
      thumbnails={project.thumbnails}
    >
      <Text style={styles.whiteText}>{project.createdAt}</Text>
    </IntoCard>
  );
};

const ProjectsList = (
  { projects }: { projects: Project[] } = { projects: projectsSample }
) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={({ item }) => <ProjectCard project={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ProjectsList;

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
