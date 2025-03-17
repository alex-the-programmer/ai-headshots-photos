import IntoCard from "@/components/common/intoCard";
import Loading from "@/components/common/loading";
import {
  useGenderSelectorQuery,
  useUpdateProjectPropertyValueMutation,
} from "@/generated/graphql";
import { gql } from "@apollo/client";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View, Animated, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import React, { useRef, useEffect, useState } from "react";

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
  female: '#9C27B0',          // Purple for female option
  male: '#3B82F6',            // Blue for male option
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

const GenderSelection = () => {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const { data: genderSelectorData } = useGenderSelectorQuery();
  const [updateProjectPropertyValue] = useUpdateProjectPropertyValueMutation();
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const femaleCardAnim = useRef(new Animated.Value(1)).current;
  const maleCardAnim = useRef(new Animated.Value(1)).current;
  
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

  if (!genderSelectorData) {
    return <Loading />;
  }

  const selectGender = async (gender: string) => {
    setSelectedGender(gender);
    
    // Animate card selection
    if (gender === "Female") {
      Animated.parallel([
        Animated.spring(femaleCardAnim, {
          toValue: 1.05,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(maleCardAnim, {
          toValue: 0.95,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(maleCardAnim, {
          toValue: 1.05,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(femaleCardAnim, {
          toValue: 0.95,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    // Delay navigation to show the animation
    setTimeout(async () => {
      const genderPropertyValue = genderSelectorData.availableProperties.nodes
        .find((property) => property.name === "Gender")
        ?.propertyValues.nodes.find((value) => value.name === gender);

      await updateProjectPropertyValue({
        variables: {
          projectId: projectId,
          propertyValueId: genderPropertyValue?.id ?? "",
        },
      });
      
      router.push({
        pathname: "/imagesUpload",
        params: {
          projectId,
        },
      });
    }, 600);
  };

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
          <Text style={styles.header}>
            Choose Gender
          </Text>
          <Text style={styles.subheader}>
            Select the gender for your AI-generated headshots
          </Text>
        </View>
        
        <View style={styles.cardsContainer}>
          {/* Female Card */}
          <Animated.View 
            style={[
              styles.genderCardContainer,
              { 
                transform: [{ scale: femaleCardAnim }],
              }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.genderCard,
                selectedGender === "Female" && styles.selectedCard
              ]}
              onPress={() => selectGender("Female")}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[`${COLORS.female}40`, `${COLORS.female}20`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Image
                source={require("../assets/images/genderSelection/femalePlaceholder.png")}
                style={styles.genderImage}
              />
              <BlurView intensity={20} tint="dark" style={styles.textContainer}>
                <Text style={styles.genderText}>Female</Text>
              </BlurView>
              
              {selectedGender === "Female" && (
                <View style={styles.selectedIndicator}>
                  <LinearGradient
                    colors={[`${COLORS.female}CC`, `${COLORS.female}80`]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
          
          {/* Male Card */}
          <Animated.View 
            style={[
              styles.genderCardContainer,
              { 
                transform: [{ scale: maleCardAnim }],
              }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.genderCard,
                selectedGender === "Male" && styles.selectedCard
              ]}
              onPress={() => selectGender("Male")}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[`${COLORS.male}40`, `${COLORS.male}20`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Image
                source={require("../assets/images/genderSelection/malePlaceholder.jpg")}
                style={styles.genderImage}
              />
              <BlurView intensity={20} tint="dark" style={styles.textContainer}>
                <Text style={styles.genderText}>Male</Text>
              </BlurView>
              
              {selectedGender === "Male" && (
                <View style={styles.selectedIndicator}>
                  <LinearGradient
                    colors={[`${COLORS.male}CC`, `${COLORS.male}80`]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
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
    backgroundColor: `${COLORS.female}20`,
    top: -100,
    right: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${COLORS.male}20`,
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
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: SPACING.sm,
    textAlign: "center",
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subheader: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
  cardsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  genderCardContainer: {
    width: '45%',
    aspectRatio: 0.8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  genderCard: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  genderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    alignItems: 'center',
  },
  genderText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "600",
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default GenderSelection;

export const QUERY_GENDER_SELECTOR = gql`
  query GenderSelector {
    availableProperties(propertyType: FOR_PROJECT) {
      nodes {
        id
        name
        propertyValues {
          nodes {
            id
            name
          }
        }
      }
    }
  }
`;

export const UPDATE_PROJECT_PROPERTY_VALUE_MUTATION = gql`
  mutation UpdateProjectPropertyValue($projectId: ID!, $propertyValueId: ID!) {
    updateProjectPropertyValue(
      input: { projectId: $projectId, propertyValueId: $propertyValueId }
    ) {
      project {
        id
        genderPropertyValue {
          id
        }
      }
    }
  }
`;
