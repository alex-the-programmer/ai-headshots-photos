import { ProjectsNavigationProp } from "@/types/navigation";
import { Text, StyleSheet, View, Animated } from "react-native";
import IntoCard from "@/components/common/intoCard";
import { gql } from "@apollo/client";
import {
  ProjectCardFragment,
  ProjectProcessingStatusEnum,
  OrderProcessingStatusEnum,
} from "@/generated/graphql";
import dayjs from "dayjs";
import { router } from "expo-router";
import React, { useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

// Define consistent colors
const COLORS = {
  primary: '#6C5CE7',         // Main purple color
  primaryLight: '#8A7EFF',    // Lighter purple accent
  primaryDark: '#5546D3',     // Darker purple accent
  success: '#10B981',         // Green for success
  warning: '#F59E0B',         // Yellow for warning
  error: '#EF4444',           // Red for error
  processing: '#3B82F6',      // Blue for processing
  text: '#FFFFFF',            // White text
  textSecondary: 'rgba(255, 255, 255, 0.8)', // Slightly transparent white text
};

// Define fallback image for projects without a photo URL
const DEFAULT_PROJECT_IMAGE = 'https://via.placeholder.com/150/333333/FFFFFF?text=AI+Headshot';

const ProjectCard = ({
  project,
  navigation,
  index = 0,
}: {
  project: ProjectCardFragment;
  navigation: ProjectsNavigationProp;
  index?: number;
}) => {
  // Animation values - using only native animations here
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    // Entrance animations with staggered delay based on index
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);
  
  const isClickable =
    [
      ProjectProcessingStatusEnum.AllImagesGenerated,
      ProjectProcessingStatusEnum.HasInvalidImages,
    ].includes(project.processingStatus as ProjectProcessingStatusEnum) ||
    project.hasInvalidImages ||
    // Allow projects with payment processed status to be clickable
    (project.processingStatus === ProjectProcessingStatusEnum.Created &&
     project.orders.nodes.length > 0 &&
     project.orders.nodes[0].processingStatus === OrderProcessingStatusEnum.PaymentProcessed);

  const handlePress = () => {
    if (!isClickable) return;

    try {
      console.log("Navigating to project:", project.id, "Status:", project.processingStatus);
      
      if (project.hasInvalidImages) {
        router.push({
          pathname: "/imagesUpload",
          params: { projectId: project.id },
        });
      } else if (
        project.processingStatus === ProjectProcessingStatusEnum.Created &&
        project.orders.nodes.length > 0 &&
        project.orders.nodes[0].processingStatus === OrderProcessingStatusEnum.PaymentProcessed
      ) {
        // For payment processed projects, navigate to styles selection
        router.push({
          pathname: "/stylesSelection",
          params: { projectId: project.id },
        });
      } else if (project.processingStatus === ProjectProcessingStatusEnum.AllImagesGenerated) {
        // For finished projects with generated images
        console.log("Navigating to generated images for project:", project.id);
        router.push({
          pathname: "/projectStack",
          params: {
            projectId: project.id,
            initialScreen: "Styles",
          },
        });
      } else {
        // Default navigation
        console.log("Default navigation for project:", project.id);
        router.push({
          pathname: "/projectStack",
          params: {
            projectId: project.id,
            initialScreen: "Styles",
          },
        });
      }
    } catch (error) {
      console.error("Error navigating to project:", error);
    }
  };

  if (!project) return null;

  const getStatusInfo = () => {
    if (project.hasInvalidImages) {
      return {
        text: "Needs attention",
        color: COLORS.warning,
        icon: "⚠️"
      };
    }
    if (
      project.processingStatus === ProjectProcessingStatusEnum.Created &&
      project.orders.nodes.length > 0
    ) {
      const orderStatus = project.orders.nodes[0].processingStatus;
      if (orderStatus === OrderProcessingStatusEnum.PaymentProcessed) {
        return {
          text: "Payment processed",
          color: COLORS.success,
          icon: "✓"
        };
      }
      if (orderStatus === OrderProcessingStatusEnum.PaymentProcessingError) {
        return {
          text: "Payment processing error",
          color: COLORS.error,
          icon: "✗"
        };
      }
    }
    if (
      project.processingStatus ===
      ProjectProcessingStatusEnum.AllImagesGenerated
    ) {
      return {
        text: "Images generated",
        color: COLORS.success,
        icon: "✓"
      };
    }

    if (project.processingStatus === ProjectProcessingStatusEnum.Processing) {
      return {
        text: "Processing",
        color: COLORS.processing,
        icon: "⟳"
      };
    }
    
    return {
      text: project.processingStatus,
      color: COLORS.primaryLight,
      icon: "•"
    };
  };
  
  const statusInfo = getStatusInfo();
  const formattedDate = dayjs(project.createdAt).format("MMM DD, YYYY");
  const stylesCount = project.projectStyles?.nodes?.length || 0;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}
    >
      <IntoCard
        onPress={handlePress}
        thumbnails={[project.projectPhotoUrl || DEFAULT_PROJECT_IMAGE]}
        disabled={!isClickable}
      >
        <View style={styles.contentContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formattedDate}</Text>
            {stylesCount > 0 && (
              <Text style={styles.stylesText}>
                {stylesCount} {stylesCount === 1 ? 'style' : 'styles'}
              </Text>
            )}
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: statusInfo.color }]}>
              <LinearGradient
                colors={[`${statusInfo.color}`, `${statusInfo.color}99`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
            </View>
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>
      </IntoCard>
    </Animated.View>
  );
};

export default ProjectCard;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  dateContainer: {
    marginBottom: 8,
  },
  dateText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  stylesText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    overflow: "hidden",
  },
  statusIcon: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "bold",
  },
  statusText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});

export const FRAGMENT_PROJECT_CARD = gql`
  fragment projectCard on Project {
    id
    processingStatus
    hasInvalidImages
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
