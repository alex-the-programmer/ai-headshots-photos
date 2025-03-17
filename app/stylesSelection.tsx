import Loading from "@/components/common/loading";
import PrimaryButton from "@/components/common/primaryButton";
import SelectedStyles from "@/components/stylesSelection/selectedStyles";
import StylesList from "@/components/stylesSelection/stylesList";
import { 
  useStylesSelectionPageQuery
} from "@/generated/graphql";
import { gql } from "@apollo/client";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useRef, useEffect, useState } from "react";
import { Text, StyleSheet, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

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

const StylesSelection = () => {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const { data, loading } = useStylesSelectionPageQuery({
    variables: {
      projectId,
    },
    fetchPolicy: 'cache-and-network',
  });

  // Animation values - always initialize these regardless of loading state
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

  // Calculate if user can select more styles - do this outside the render return
  const canSelectMoreStyles = useMemo(() => {
    if (!data) return true;
    
    const selectedStylesCount =
      data.currentUser?.project?.projectStyles?.nodes?.length ?? 0;
    const maxStylesCount =
      data.currentUser?.project?.orders?.nodes?.[0]?.package?.stylesCount ?? 0;
    return selectedStylesCount < maxStylesCount;
  }, [data]);

  if (loading && !data) {
    return <Loading />;
  }

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
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Select Styles</Text>
          <Text style={styles.subheader}>
            Choose {canSelectMoreStyles ? "up to " : ""}
            {data?.currentUser?.project?.orders?.nodes?.[0]?.package?.stylesCount} styles for your photos
          </Text>
        </View>
        
        <View style={styles.contentContainer}>
          <StylesList
            availableStyles={data?.availableStyles?.nodes || []}
            availableProperties={data?.availableProperties?.nodes || []}
            projectId={projectId}
            disabled={!canSelectMoreStyles}
          />
        </View>
        
        <View style={styles.selectedStylesContainer}>
          <BlurView intensity={20} tint="dark" style={styles.selectedStylesBlur}>
            <LinearGradient
              colors={[`${COLORS.primary}40`, `${COLORS.primaryDark}60`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.selectedStylesTitle}>Selected Styles</Text>
            {data?.currentUser?.project && (
              <SelectedStyles cart={data.currentUser.project} />
            )}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                text="Continue to Next Step"
                disabled={canSelectMoreStyles}
                onPress={() => {
                  router.push({
                    pathname: "/genderSelection",
                    params: {
                      projectId,
                    },
                  });
                }}
              />
            </View>
          </BlurView>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

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
  headerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    alignItems: 'center',
  },
  header: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subheader: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  selectedStylesContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  selectedStylesBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: SPACING.md,
  },
  selectedStylesTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    marginTop: SPACING.md,
  },
});

export default StylesSelection;

export const QUERY_STYLES_SELECTION_PAGE = gql`
  query StylesSelectionPage($projectId: ID!) {
    availableStyles {
      nodes {
        id
        name
        description
        imageUrl
      }
    }
    availableProperties(propertyType: FOR_STYLE) {
      nodes {
        id
        name
        propertyValues {
          nodes {
            id
            name
            imageUrl
          }
        }
      }
    }
    currentUser {
      project(id: $projectId) {
        id
        projectStyles {
          nodes {
            id
            style {
              id
              name
              description
              imageUrl
            }
            styleProperties {
              nodes {
                id
                propertyValue {
                  id
                  name
                  imageUrl
                  property {
                    id
                    name
                  }
                }
              }
            }
          }
        }
        orders {
          nodes {
            id
            package {
              id
              stylesCount
            }
          }
        }
      }
    }
  }
`;

// on project
// ...projectStyleSelectionCard
//
