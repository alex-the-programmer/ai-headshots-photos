import IntoCard from "@/components/common/intoCard";
import { View, FlatList, StyleSheet, SafeAreaView, Text, Animated } from "react-native";
import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "./projectStack";
import { gql } from "@apollo/client";
import ProjectCard from "@/components/projectsList/projectCard";
import {
  ProjectCardFragment,
  useCreateProjectMutation,
  useProjectsListQuery,
} from "@/generated/graphql";
import Loading from "@/components/common/loading";
import PrimaryButton from "@/components/common/primaryButton";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import React, { useRef, useEffect } from "react";
import { ProjectsNavigationProp } from "@/types/navigation";

// Define consistent colors
const COLORS = {
  background: '#14142B',      // Dark purple background
  backgroundDark: '#0f0f23',  // Darker purple for gradient
  backgroundLight: '#2D2B55', // Lighter purple for gradient
  primary: '#6C5CE7',         // Main purple color
  primaryLight: '#8A7EFF',    // Lighter purple accent
  primaryDark: '#5546D3',     // Darker purple accent
  text: '#FFFFFF',            // White text
  textSecondary: 'rgba(255, 255, 255, 0.8)', // Slightly transparent white text
  accent: '#7c3aed',          // Bright purple accent
};

// Define consistent spacing
const SPACING = {
  xs: 4,   // Extra small spacing
  sm: 8,   // Small spacing
  md: 16,  // Medium spacing
  lg: 24,  // Large spacing
  xl: 32,  // Extra large spacing
  xxl: 48, // Extra extra large spacing
};

type Project = {
  id: string;
  createdAt: string;
  status: string;
  thumbnails: string[];
};

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
  const { data: projectsListData, loading, refetch } = useProjectsListQuery();
  const [createProject] = useCreateProjectMutation();
  
  // Animation values - using only native animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);
  
  if (loading) return <Loading />;
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={[COLORS.backgroundDark, COLORS.background, COLORS.backgroundLight]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Decorative elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <BlurView intensity={30} tint="dark" style={styles.blurOverlay} />
      
      <Animated.View 
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Your Projects</Text>
            <Text style={styles.subheader}>
              Manage and create new AI headshot projects
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <PrimaryButton
              text="Create New Project"
              onPress={async () => {
                const { data: projectData } = await createProject();
                router.replace({
                  pathname: "/packageSelection",
                  params: {
                    projectId: projectData?.createProject?.project?.id,
                  },
                });
              }}
            />
          </View>

          <FlatList
            data={projectsListData?.currentUser?.projects?.nodes}
            renderItem={({ item, index }) => (
              <ProjectCard 
                project={item} 
                navigation={navigation} 
                index={index}
              />
            )}
            keyExtractor={(item) => item.id}
            onRefresh={() => refetch()}
            refreshing={loading}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ProjectsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: `${COLORS.primary}20`,
    top: -100,
    right: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${COLORS.primaryLight}15`,
    bottom: 50,
    left: -50,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  headerContainer: {
    marginBottom: SPACING.lg,
  },
  header: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subheader: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: SPACING.lg,
  },
  listContent: {
    paddingBottom: SPACING.xl,
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
