/**
 * imageViewer.tsx
 * 
 * A full-screen image viewer component with swipe navigation and download functionality.
 * Allows users to view images in full screen, swipe between them, and download to camera roll.
 * 
 * Date: 2024-03-16
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ImageCardFragment } from '@/generated/graphql';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing,
  withSequence,
  runOnJS
} from 'react-native-reanimated';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  overlay: 'rgba(0, 0, 0, 0.7)', // Modal overlay
};

interface ImageViewerProps {
  visible: boolean;
  onClose: () => void;
  image: ImageCardFragment;
  onDownload: () => void;
  images?: ImageCardFragment[];
  initialIndex?: number;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  visible,
  onClose,
  image,
  onDownload,
  images = [],
  initialIndex = 0
}) => {
  // If images array is empty but we have a single image, create an array with just that image
  const allImages = images.length > 0 ? images : [image];
  
  // State for tracking loaded images
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
  // Ref for FlatList
  const flatListRef = useRef<FlatList>(null);
  
  // State for current image index
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // State for UI visibility (tap to hide/show controls)
  const [controlsVisible, setControlsVisible] = useState(true);
  
  // Animation values
  const controlsOpacity = useSharedValue(1);
  const imageOpacity = useSharedValue(0);
  
  // Background animation values
  const bgBubble1Position = useSharedValue(0);
  const bgBubble2Position = useSharedValue(0);
  const bgBubble3Position = useSharedValue(0);
  
  // Loading animation values
  const pulseAnim1 = useSharedValue(0);
  const pulseAnim2 = useSharedValue(0);
  const pulseAnim3 = useSharedValue(0);
  
  // Reset loaded images when modal becomes visible
  useEffect(() => {
    if (visible) {
      setLoadedImages({});
      imageOpacity.value = 0;
    }
  }, [visible]);
  
  // Start background animations
  useEffect(() => {
    if (visible) {
      // Animate background elements
      bgBubble1Position.value = withRepeat(
        withTiming(1, { duration: 15000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      
      bgBubble2Position.value = withRepeat(
        withTiming(1, { duration: 20000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      
      bgBubble3Position.value = withRepeat(
        withTiming(1, { duration: 25000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      
      // Loading animations
      pulseAnim1.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      
      pulseAnim2.value = withDelay(
        200,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        )
      );
      
      pulseAnim3.value = withDelay(
        400,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        )
      );
    }
  }, [visible]);
  
  // Create animated styles
  const animatedDot1Style = useAnimatedStyle(() => ({
    opacity: 0.3 + pulseAnim1.value * 0.7,
    transform: [{ scale: 0.8 + pulseAnim1.value * 0.4 }]
  }));
  
  const animatedDot2Style = useAnimatedStyle(() => ({
    opacity: 0.3 + pulseAnim2.value * 0.7,
    transform: [{ scale: 0.8 + pulseAnim2.value * 0.4 }]
  }));
  
  const animatedDot3Style = useAnimatedStyle(() => ({
    opacity: 0.3 + pulseAnim3.value * 0.7,
    transform: [{ scale: 0.8 + pulseAnim3.value * 0.4 }]
  }));
  
  const animatedImageStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value
  }));
  
  const animatedControlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value
  }));
  
  // Background bubble animations
  const bgBubble1Style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: -50 + bgBubble1Position.value * 100 },
        { translateY: -100 + bgBubble1Position.value * 200 },
      ],
    };
  });
  
  const bgBubble2Style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: 100 - bgBubble2Position.value * 150 },
        { translateY: 50 - bgBubble2Position.value * 100 },
      ],
    };
  });
  
  const bgBubble3Style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: -150 + bgBubble3Position.value * 300 },
        { translateY: 200 - bgBubble3Position.value * 250 },
      ],
    };
  });
  
  // Effect to scroll to initial index
  useEffect(() => {
    if (visible && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: initialIndex,
        animated: false
      });
    }
  }, [visible, initialIndex]);
  
  // Handle image load complete
  const handleImageLoad = (id: string) => {
    // Add a small delay to ensure the image is fully rendered
    setTimeout(() => {
      setLoadedImages(prev => ({
        ...prev,
        [id]: true
      }));
      
      // Fade in the image
      imageOpacity.value = withTiming(1, { duration: 300 });
    }, 100);
  };
  
  // Toggle controls visibility
  const toggleControls = () => {
    const newVisibility = !controlsVisible;
    setControlsVisible(newVisibility);
    
    controlsOpacity.value = withTiming(newVisibility ? 1 : 0, { 
      duration: 300,
      easing: Easing.inOut(Easing.ease)
    });
  };
  
  // Handle swipe to change image
  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      
      // Reset image opacity for the new image
      const isLoaded = loadedImages[viewableItems[0].item.id];
      imageOpacity.value = isLoaded ? 1 : 0;
    }
  };
  
  // Viewability config for FlatList
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  };
  
  // Render each image item
  const renderItem = ({ item }: { item: ImageCardFragment }) => {
    const isLoaded = loadedImages[item.id] || false;
    
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.imageContainer}
        onPress={toggleControls}
      >
        {/* Image with opacity animation - Now on top with higher zIndex */}
        <Animated.View style={[styles.imageWrapper, animatedImageStyle]}>
          <Image
            source={{ uri: item.originalUrl }}
            style={styles.fullImage}
            resizeMode="contain"
            onLoad={() => handleImageLoad(item.id)}
          />
        </Animated.View>
        
        {/* Loading Animation - Now below the image with lower zIndex and pointerEvents set to none */}
        <View style={styles.loadingContainer} pointerEvents="none">
          <BlurView intensity={20} tint="dark" style={styles.loadingBlur}>
            <View style={styles.loadingContent}>
              <Animated.View style={[styles.loadingDot, animatedDot1Style]} />
              <Animated.View style={[styles.loadingDot, animatedDot2Style]} />
              <Animated.View style={[styles.loadingDot, animatedDot3Style]} />
            </View>
          </BlurView>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.container}>
        {/* Enhanced background with gradient and animated elements */}
        <LinearGradient
          colors={[
            COLORS.backgroundDark, 
            'rgba(40, 38, 80, 0.8)', 
            COLORS.background
          ]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Animated background elements */}
        <Animated.View style={[styles.bgBubble, styles.bgBubble1, bgBubble1Style]}>
          <LinearGradient
            colors={['rgba(108, 92, 231, 0.1)', 'rgba(108, 92, 231, 0.05)']}
            style={styles.bubbleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        
        <Animated.View style={[styles.bgBubble, styles.bgBubble2, bgBubble2Style]}>
          <LinearGradient
            colors={['rgba(138, 126, 255, 0.08)', 'rgba(138, 126, 255, 0.02)']}
            style={styles.bubbleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        
        <Animated.View style={[styles.bgBubble, styles.bgBubble3, bgBubble3Style]}>
          <LinearGradient
            colors={['rgba(85, 70, 211, 0.1)', 'rgba(85, 70, 211, 0.03)']}
            style={styles.bubbleGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        
        {/* Image Gallery */}
        <FlatList
          ref={flatListRef}
          data={allImages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />
        
        {/* Top Controls */}
        <Animated.View style={[styles.topControls, animatedControlsStyle]}>
          <SafeAreaView style={styles.topControlsInner}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={COLORS.text} />
            </TouchableOpacity>
            
            <Text style={styles.imageCounter}>
              {currentIndex + 1} / {allImages.length}
            </Text>
          </SafeAreaView>
        </Animated.View>
        
        {/* Bottom Controls */}
        <Animated.View style={[styles.bottomControls, animatedControlsStyle]}>
          <BlurView intensity={20} tint="dark" style={styles.bottomControlsInner}>
            <TouchableOpacity onPress={onDownload} style={styles.downloadButton}>
              <Ionicons name="download" size={24} color={COLORS.text} />
              <Text style={styles.downloadText}>Save to Photos</Text>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10, // Higher zIndex to appear above loading animation
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 5, // Lower zIndex to appear below the image
  },
  loadingBlur: {
    width: 120,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primaryLight,
    marginHorizontal: 6,
  },
  // Background bubble styles
  bgBubble: {
    position: 'absolute',
    borderRadius: 300,
    overflow: 'hidden',
  },
  bgBubble1: {
    width: 300,
    height: 300,
    top: '10%',
    left: '50%',
  },
  bgBubble2: {
    width: 250,
    height: 250,
    top: '40%',
    right: '20%',
  },
  bgBubble3: {
    width: 400,
    height: 400,
    bottom: '10%',
    left: '30%',
  },
  bubbleGradient: {
    width: '100%',
    height: '100%',
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20, // Highest zIndex for controls
  },
  topControlsInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCounter: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20, // Highest zIndex for controls
  },
  bottomControlsInner: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingBottom: 40, // Extra padding for bottom safe area
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  downloadText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ImageViewer; 