import { Project } from "@/types/project";
import { ProjectsNavigationProp } from "@/types/navigation";
import { Text, StyleSheet } from "react-native";
import IntoCard from "@/components/common/intoCard";
import { gql } from "@apollo/client";
import { ProjectCardFragment } from "@/generated/graphql";

const ProjectCard = ({
  project,
  navigation,
}: {
  project: ProjectCardFragment;
  navigation: ProjectsNavigationProp;
}) => {
  const handlePress = () => {
    console.log("navigation before navigating ", navigation);
    navigation.navigate("Styles", {
      projectId: "1",
    });
  };
  if (!project) return null;

  return (
    <IntoCard
      onPress={handlePress}
      thumbnails={[project.projectPhotoUrl || ""]}
    >
      <Text style={styles.whiteText}>{project.createdAt}</Text>
      <Text style={styles.whiteText}>{project.processingStatus}</Text>
    </IntoCard>
  );
};

export default ProjectCard;

const styles = StyleSheet.create({
  whiteText: {
    color: "white",
  },
});

export const FRAGMENT_PROJECT_CARD = gql`
  fragment projectCard on Project {
    id
    processingStatus
    projectPhotoUrl
    createdAt
    projectStyles {
      nodes {
        id
        nameWithProperties
      }
    }
    orders {
      nodes {
        id
        processingStatus
      }
    }
  }
`;
