import React, { useRef, useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

// Define consistent colors
const COLORS = {
  primary: '#6C5CE7',         // Main purple color
  primaryLight: '#8A7EFF',    // Lighter purple accent
  primaryDark: '#5546D3',     // Darker purple accent
  accent: '#7c3aed',          // Bright purple accent
  glow: '#9D6FFF',            // Glow color
  text: '#FFFFFF',            // White text
};

const PrimaryButton = ({
  text,
  onPress,
  disabled,
}: {
  text: string;
  onPress: () => void;
  disabled?: boolean;
}) => {
  // Animation values - separate values for native and JS animations
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current; // For native animations
  const glowAnim = useRef(new Animated.Value(0)).current; // For JS animations only
  
  // Handle press animations
  const handlePressIn = () => {
    setIsPressed(true);
    // Native animation
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    // JS animation
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };
  
  const handlePressOut = () => {
    setIsPressed(false);
    // Native animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    // JS animation
    Animated.timing(glowAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  // Interpolate glow opacity
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.7],
  });
  
  if (disabled) {
    return (
      <View style={styles.buttonContainer}>
        <View style={[styles.button, styles.buttonDisabled]}>
          <LinearGradient
            colors={['rgba(156, 163, 175, 0.7)', 'rgba(156, 163, 175, 0.5)', 'rgba(156, 163, 175, 0.3)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={[styles.buttonText, styles.buttonTextDisabled]}>
            {text}
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.buttonContainer}>
      {/* Glow effect */}
      <Animated.View 
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
          }
        ]}
      >
        <BlurView intensity={50} tint="default" style={styles.blurGlow} />
      </Animated.View>
      
      {/* Button */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          width: '100%',
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={isPressed 
              ? [COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]
              : [COLORS.primaryLight, COLORS.primary, COLORS.primaryDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.buttonText}>
            {text}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonTextDisabled: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: COLORS.glow,
    zIndex: -1,
  },
  blurGlow: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});
