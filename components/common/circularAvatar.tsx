import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const CircularAvatar = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <View style={styles.avatarContainer}>
      <LinearGradient
        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      />
      <Image source={{ uri: imageUrl }} style={styles.avatar} />
    </View>
  );
};

export default CircularAvatar;

const styles = StyleSheet.create({
  avatarContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatar: {
    width: '96%',
    height: '96%',
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
});
