import { View, Text, StyleSheet, ActivityIndicator, Animated } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { gql } from "@apollo/client";
import SignInButton from "@/components/welcome/signInButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useEffect } from "react";
import Loading from "@/components/common/loading";
import { useWelcomePageCheckSessionQuery } from "@/generated/graphql";
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

// Initialize WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasSession, setHasSession] = React.useState(false);
  const { data: sessionData, loading: queryLoading } =
    useWelcomePageCheckSessionQuery({
      skip: !hasSession,
    });
    
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  // Background animation
  const gradientPosition = useRef(new Animated.Value(0)).current;
  
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

    // Continuous gradient animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientPosition, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(gradientPosition, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, gradientPosition]);

  React.useEffect(() => {
    const checkSession = async () => {
      // await AsyncStorage.clear(); // todo remove this once we have a list of projects.
      const sessionToken = await AsyncStorage.getItem("session");
      setHasSession(!!sessionToken);
    };

    checkSession();
  }, []);

  React.useEffect(() => {
    if (hasSession && !queryLoading) {
      setIsLoading(false);
      const hasProjects =
        (sessionData?.currentUser?.projects?.nodes ?? []).length > 0;
      if (hasProjects) {
        router.replace("/projectStack");
      } else {
        router.replace("/packageSelection");
      }
    } else if (!hasSession) {
      setIsLoading(false);
    }
  }, [hasSession, queryLoading, sessionData, router]);

  if (isLoading) {
    return <Loading />;
  }
  
  // Interpolate gradient colors based on animation
  const gradientColors = gradientPosition.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      COLORS.primary, 
      COLORS.primaryDark, 
      COLORS.primary
    ],
  });

  return (
    <View style={styles.container}>
      {/* Animated background gradient */}
      <Animated.View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[COLORS.backgroundDark, COLORS.background, COLORS.backgroundLight]}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View 
          style={[
            StyleSheet.absoluteFill, 
            styles.gradientOverlay,
            { opacity: gradientPosition.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 0.5, 0.3],
              }) 
            }
          ]}
        >
          <LinearGradient
            colors={['transparent', COLORS.primary, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Animated.View>

      {/* Grid of AI artwork examples */}
      <View style={styles.artworkGrid}>
        {/* You'll need to add your artwork images here */}
      </View>

      {/* Welcome Text with animation */}
      <Animated.View 
        style={[
          styles.textContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        <Text style={styles.title}>Create your own masterpiece with AI</Text>
        <Text style={styles.subtitle}>
          Turn your ideas into AI powered artwork in seconds
        </Text>
      </Animated.View>

      {/* Start Creating Button with animation */}
      <Animated.View 
        style={{ 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          marginBottom: SPACING.xl,
        }}
      >
        <SignInButton />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  gradientOverlay: {
    position: "absolute",
    width: "200%",
    height: "200%",
    top: "-50%",
    left: "-50%",
    transform: [{ rotate: "45deg" }],
  },
  artworkGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "40%",
    padding: SPACING.md,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SPACING.md,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
});

const welcomePageCheckSessionQuery = gql`
  query WelcomePageCheckSession {
    currentUser {
      id
      projects {
        nodes {
          id
        }
      }
    }
  }
`;
