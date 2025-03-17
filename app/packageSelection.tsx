import PackageCard from "@/components/packageSelection/packageCard";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { gql } from "@apollo/client";
import { usePackageSelectionPageQuery } from "@/generated/graphql";
import Loading from "@/components/common/loading";
import { useLocalSearchParams } from "expo-router";
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
  gold: '#FFD700',            // Gold color for premium elements
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

const PackageSelectionScreen = () => {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { data: packageList } = usePackageSelectionPageQuery();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Animation values
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

  // Handler for when a package is being processed
  const handleProcessingStateChange = (isProcessing: boolean) => {
    setIsProcessingPayment(isProcessing);
  };

  if (!packageList) {
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
      <BlurView intensity={50} tint="dark" style={styles.blurOverlay} />
      
      <Animated.View 
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={require("../assets/images/packageSelection/hero.png")}
            style={styles.heroImage}
          />
          <BlurView intensity={30} tint="dark" style={styles.imageOverlay}>
            <LinearGradient
              colors={['transparent', `${COLORS.background}CC`]}
              style={styles.imageGradient}
            />
          </BlurView>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium Quality</Text>
          </View>
          <Text style={styles.heroTitle}>Choose a package</Text>
          <Text style={styles.heroSubtitle}>Select the perfect option for your needs</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <TouchableOpacity style={styles.featureButton} disabled={isProcessingPayment}>
            <LinearGradient
              colors={[`${COLORS.primary}CC`, `${COLORS.primary}99`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureGradient}
            />
            <Text style={styles.featureText}>AI Generation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureButton} disabled={isProcessingPayment}>
            <LinearGradient
              colors={[`${COLORS.primaryDark}CC`, `${COLORS.primaryDark}99`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureGradient}
            />
            <Text style={styles.featureText}>🎬 Ad-Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureButton} disabled={isProcessingPayment}>
            <LinearGradient
              colors={[`${COLORS.primaryLight}CC`, `${COLORS.primaryLight}99`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureGradient}
            />
            <Text style={styles.featureText}>⚡️ Faster</Text>
          </TouchableOpacity>
        </View>

        {/* Plans Section */}
        <View style={styles.plansSection}>
          <Text style={styles.planTitle}>Select a plan</Text>
          {isProcessingPayment && (
            <View style={styles.processingOverlay}>
              <Text style={styles.processingText}>Processing payment...</Text>
              <Text style={styles.processingSubtext}>Please wait while we complete your purchase</Text>
            </View>
          )}
          <FlatList
            data={packageList?.availablePackages?.nodes}
            renderItem={({ item }) => (
              <PackageCard
                key={item.id}
                packageNode={item}
                projectId={projectId}
                onProcessingStateChange={handleProcessingStateChange}
                disabled={isProcessingPayment}
              />
            )}
            keyExtractor={(item) => item.id}
            style={styles.plansContainer}
            contentContainerStyle={styles.plansContentContainer}
            showsVerticalScrollIndicator={false}
          />
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
  heroSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    position: 'relative',
  },
  heroImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: SPACING.lg,
    right: SPACING.lg,
    height: 200,
    borderRadius: 16,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  premiumBadge: {
    backgroundColor: `${COLORS.gold}E6`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  premiumText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: SPACING.md,
    textAlign: "center",
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  featureButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  featureText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 12,
  },
  plansSection: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    position: 'relative',
  },
  processingOverlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
  },
  processingText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  processingSubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  planTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: SPACING.md,
  },
  plansContainer: {
    flex: 1,
  },
  plansContentContainer: {
    paddingBottom: SPACING.xl,
  },
});

export default PackageSelectionScreen;

const PACKAGE_SELECTION_PAGE_QUERY = gql`
  query PackageSelectionPage {
    availablePackages {
      nodes {
        ...PackageCard
      }
    }
  }
`;
