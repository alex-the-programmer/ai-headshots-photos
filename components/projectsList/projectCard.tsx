import { ProjectsNavigationProp } from "@/types/navigation";
import { Text, StyleSheet } from "react-native";
import IntoCard from "@/components/common/intoCard";
import { gql } from "@apollo/client";
import {
  ProjectCardFragment,
  ProjectProcessingStatusEnum,
  OrderProcessingStatusEnum,
} from "@/generated/graphql";
import dayjs from "dayjs";

const ProjectCard = ({
  project,
  navigation,
}: {
  project: ProjectCardFragment;
  navigation: ProjectsNavigationProp;
}) => {
  const isClickable = [
    ProjectProcessingStatusEnum.AllImagesGenerated,
    ProjectProcessingStatusEnum.HasInvalidImages,
  ].includes(project.processingStatus as ProjectProcessingStatusEnum);

  const handlePress = () => {
    if (!isClickable) return;

    console.log("navigation before navigating ", navigation);
    navigation.navigate("Styles", {
      projectId: project.id,
    });
  };

  if (!project) return null;

  const getStatusText = () => {
    if (
      project.processingStatus === ProjectProcessingStatusEnum.Created &&
      project.orders.nodes.length > 0
    ) {
      const orderStatus = project.orders.nodes[0].processingStatus;
      if (orderStatus === OrderProcessingStatusEnum.PaymentProcessed) {
        return "Payment processed";
      }
      if (orderStatus === OrderProcessingStatusEnum.PaymentProcessingError) {
        return "Payment processing error";
      }
    }
    return project.processingStatus;
  };

  return (
    <IntoCard
      onPress={handlePress}
      thumbnails={[project.projectPhotoUrl || ""]}
      disabled={!isClickable}
    >
      <Text style={styles.whiteText}>
        {dayjs(project.createdAt).format("MM/DD/YYYY")}
      </Text>
      <Text style={styles.whiteText}>{getStatusText()}</Text>
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
