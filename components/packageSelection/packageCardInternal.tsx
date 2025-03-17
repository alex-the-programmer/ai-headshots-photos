import { PackageCardFragment } from "@/generated/graphql";
import { gql } from "@apollo/client";
import { TouchableOpacity, View, StyleSheet, Text, Animated, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";

const PackageCardInternal = ({
  packageNode,
  onPress,
  disabled = false,
}: {
  packageNode: PackageCardFragment;
  onPress: () => void;
  disabled?: boolean;
}) => {
  // Animation for hover/press effect
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  // Handle press animations
  const handlePressIn = () => {
    if (disabled) return;
    
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      })
    ]).start();
  };
  
  const handlePressOut = () => {
    if (disabled) return;
    
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      })
    ]).start();
  };
  
  // Determine if this is a premium package
  const isPremium = packageNode.badge?.toLowerCase().includes('premium') || packageNode.preselected;
  
  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
        disabled && styles.disabledContainer,
      ]}
    >
      {/* Glow effect for selected/premium packages */}
      {isPremium && (
        <Animated.View 
          style={[
            styles.glowEffect,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 0.8],
              }),
              backgroundColor: packageNode.badgeColor?.toLowerCase() || '#7c3aed',
            }
          ]}
        />
      )}
      
      {/* Glass morphism card */}
      <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
        <TouchableOpacity
          style={[
            styles.packageCard,
            packageNode.preselected ? styles.preselectedPlan : {},
            isPressed && styles.packageCardPressed,
            disabled && styles.disabledCard,
          ]}
          onPress={disabled ? undefined : onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={disabled ? 1 : 0.9}
          disabled={disabled}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.025)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.packageHeader}>
            <Text style={[styles.packageName, disabled && styles.disabledText]}>
              {packageNode.name}
            </Text>
            {packageNode.badge ? (
              <View
                style={[
                  styles.badge,
                  // @ts-ignore
                  { backgroundColor: packageNode.badgeColor?.toLowerCase() || '#7c3aed' },
                  disabled && styles.disabledBadge,
                ]}
              >
                <Text style={styles.badgeText}>{packageNode.badge}</Text>
              </View>
            ) : null}
          </View>
          
          {/* Feature highlights */}
          <View style={styles.featuresContainer}>
            <Text style={[styles.description, disabled && styles.disabledText]}>
              <Text style={[styles.highlightText, disabled && styles.disabledHighlightText]}>
                {packageNode.headshotsCount}
              </Text> headshots with{" "}
              <Text style={[styles.highlightText, disabled && styles.disabledHighlightText]}>
                {packageNode.stylesCount}
              </Text> styles
            </Text>
          </View>
          
          {/* Price with visual emphasis */}
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, disabled && styles.disabledText]}>Price</Text>
            <Text style={[styles.price, disabled && styles.disabledText]}>${packageNode.price}</Text>
          </View>
          
          {/* Selection indicator */}
          {packageNode.preselected && (
            <View style={[styles.recommendedBadge, disabled && styles.disabledBadge]}>
              <Text style={styles.recommendedText}>Recommended</Text>
            </View>
          )}
          
          {/* Processing indicator */}
          {disabled && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          )}
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );
};

export default PackageCardInternal;

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  disabledContainer: {
    opacity: 0.9,
  },
  glowEffect: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 25,
    opacity: 0.5,
    zIndex: -1,
    transform: [{ scale: 0.85 }],
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  packageCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(42, 42, 64, 0.7)',
    overflow: 'hidden',
  },
  packageCardPressed: {
    backgroundColor: 'rgba(42, 42, 64, 0.9)',
  },
  disabledCard: {
    backgroundColor: 'rgba(42, 42, 64, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  packageName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  disabledBadge: {
    opacity: 0.6,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  featuresContainer: {
    marginVertical: 12,
  },
  description: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    lineHeight: 22,
  },
  highlightText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledText: {
    color: "rgba(255, 255, 255, 0.4)",
  },
  disabledHighlightText: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  priceContainer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
  price: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  preselectedPlan: {
    borderColor: "rgba(255, 215, 0, 0.5)",
    borderWidth: 1,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomLeftRadius: 12,
  },
  recommendedText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  processingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const PACKAGE_CARD_FRAGMENT = gql`
  fragment PackageCard on Package {
    id
    name
    price
    headshotsCount
    stylesCount
    badge
    badgeColor
    preselected
    appleProductId
  }
`;
