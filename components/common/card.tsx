import { TouchableOpacity, StyleSheet, ViewStyle, View, Animated } from "react-native";
import type { StyleProp } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import React, { useState, useRef } from "react";

const Card = ({
  children,
  onPress,
  style,
  disabled,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) => {
  // Animation for hover/press effect
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Handle press animations
  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  if (disabled) {
    return (
      <View style={[styles.cardContainer, style ?? {}]}>
        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
          <View style={[styles.planCard, styles.disabledCard]}>
            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {children}
          </View>
        </BlurView>
      </View>
    );
  }
  
  return (
    <Animated.View 
      style={[
        styles.cardContainer, 
        style ?? {},
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
        <TouchableOpacity 
          style={[
            styles.planCard,
            isPressed && styles.planCardPressed
          ]} 
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.025)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {children}
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );
};

export default Card;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  planCard: {
    backgroundColor: "rgba(42, 42, 64, 0.7)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: 'hidden',
  },
  planCardPressed: {
    backgroundColor: "rgba(42, 42, 64, 0.9)",
  },
  disabledCard: {
    opacity: 0.6,
    backgroundColor: "rgba(42, 42, 64, 0.5)",
  },
});
