import { View, TouchableOpacity, Alert, StyleSheet, Image, Modal, Text, Dimensions, SafeAreaView, StatusBar } from "react-native";
import { ImageCardFragment } from "@/generated/graphql";
import { gql } from "@apollo/client";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import ImageViewer from "../imageViewer/imageViewer";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ImageCardProps {
  image: ImageCardFragment;
  images?: ImageCardFragment[];
  initialIndex?: number;
}

const ImageCard = ({ image, images, initialIndex = 0 }: ImageCardProps) => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Animation values for the skeleton loading effect
  const shimmerValue = useSharedValue(0);
  const pulseValue = useSharedValue(0);
  
  // Start the animations when component mounts
  useEffect(() => {
    // Shimmer animation
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.ease }),
      -1, // Infinite repetitions
      true // Reverse animation
    );
    
    // Pulse animation for gradient
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repetitions
      false // Don't reverse
    );
  }, []);
  
  // Create the animated styles
  const shimmerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shimmerValue.value * 300 - 150 }],
    };
  });
  
  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.5 + pulseValue.value * 0.3,
    };
  });

  const handleDownload = async () => {
    try {
      // Request permission to save to media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to save images"
        );
        return;
      }

      // Download the image
      const filename = image.originalUrl.split("/").pop() || "download.jpg";
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        image.originalUrl,
        fileUri,
        {}
      );

      const result = await downloadResumable.downloadAsync();
      if (!result) {
        Alert.alert("Error", "Failed to download image");
        return;
      }

      const { uri } = result;

      // Save to media library
      const asset = await MediaLibrary.saveToLibraryAsync(uri);
      if (!asset) {
        Alert.alert("Error", "Failed to save image to library");
        return;
      }
      
      // Create album if it doesn't exist
      try {
        const album = await MediaLibrary.getAlbumAsync("AI Headshots");
        if (album === null) {
          await MediaLibrary.createAlbumAsync("AI Headshots", asset, false);
          Alert.alert("Success", "Image saved to 'AI Headshots' album");
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          Alert.alert("Success", "Image saved to 'AI Headshots' album");
        }
      } catch (error) {
        console.error("Error creating/using album:", error);
        Alert.alert("Success", "Image saved to your photos");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to download image");
      console.error(error);
    }
  };

  const handleLongPress = () => {
    Alert.alert("Image Options", "What would you like to do?", [
      {
        text: "Download",
        onPress: handleDownload,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handlePress = () => {
    setViewerVisible(true);
  };
  
  const handleImageLoad = () => {
    // Add a small delay to ensure the image is fully rendered
    setTimeout(() => {
      setImageLoaded(true);
    }, 50);
  };

  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity onLongPress={handleLongPress} onPress={handlePress} activeOpacity={0.9}>
        {/* Skeleton container - Now below the image with lower zIndex and pointerEvents set to none */}
        <View style={[styles.image, styles.skeletonContainer]} pointerEvents="none">
          {/* Enhanced gradient background */}
          <Animated.View style={[StyleSheet.absoluteFill, pulseStyle]}>
            <LinearGradient
              colors={[
                'rgba(30, 30, 60, 0.5)', 
                'rgba(60, 60, 100, 0.5)', 
                'rgba(40, 40, 80, 0.5)'
              ]}
              locations={[0, 0.5, 1]}
              style={styles.gradient}
            />
          </Animated.View>
          
          {/* Shimmer effect */}
          <Animated.View style={[styles.shimmer, shimmerStyle]} />
        </View>
        
        {/* Image on top with opacity animation and higher zIndex */}
        <Animated.Image
          source={{ uri: image.thumbnailUrl }}
          style={[
            styles.image, 
            styles.actualImage,
            { opacity: imageLoaded ? 1 : 0 }
          ]}
          resizeMode="cover"
          onLoad={handleImageLoad}
        />
      </TouchableOpacity>
      
      {/* Image Viewer Modal */}
      <ImageViewer 
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
        image={image}
        onDownload={handleDownload}
        images={images}
        initialIndex={initialIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    padding: 8,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  actualImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10, // Higher zIndex to appear above the skeleton
  },
  skeletonContainer: {
    backgroundColor: 'rgba(20, 20, 40, 0.5)',
    overflow: 'hidden',
    zIndex: 5, // Lower zIndex to appear below the image
  },
  gradient: {
    flex: 1,
  },
  shimmer: {
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
  }
});

export default ImageCard;

const imageCardFragment = gql`
  fragment ImageCard on GeneratedImage {
    id
    thumbnailUrl
    originalUrl
  }
`;
