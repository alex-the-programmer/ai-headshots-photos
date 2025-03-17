import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList,
  Pressable,
  Animated,
  Easing
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from 'expo-haptics';

// Define consistent colors
const COLORS = {
  primary: '#6C5CE7',         // Main purple color
  primaryLight: '#8A7EFF',    // Lighter purple accent
  primaryDark: '#5546D3',     // Darker purple accent
  text: '#FFFFFF',            // White text
  background: '#2a2a2a',      // Dark background
  modalBackground: '#1a1a1a', // Modal background
  cardBackground: '#333333',  // Card background
  selectedBackground: '#4a4a4a', // Selected item background
  borderColor: '#444444',     // Border color
  overlay: 'rgba(0, 0, 0, 0.7)', // Modal overlay
  shimmer: 'rgba(255, 255, 255, 0.1)', // Shimmer effect color
};

// Icon mapping for different option types
// This helps visually categorize different options
const OPTION_ICONS: Record<string, string> = {
  // Default icon if no specific mapping is found
  default: "circle-outline",
  
  // Clothing/Outfit related
  suit: "tie",
  casual: "tshirt-crew",
  formal: "hanger",
  business: "briefcase",
  professional: "account-tie",
  shirt: "tshirt-crew",
  tshirt: "tshirt-crew",
  jacket: "coat",
  blazer: "coat-rack",
  hoodie: "hanger",
  sweater: "hanger",
  dress: "tshirt-v",
  
  // Colors
  black: "circle",
  white: "circle-outline",
  blue: "circle",
  red: "circle",
  green: "circle",
  navy: "circle",
  gray: "circle",
  grey: "circle",
  brown: "circle",
  purple: "circle",
  pink: "circle",
  yellow: "circle",
  orange: "circle",
  
  // Gender
  male: "gender-male",
  female: "gender-female",
  
  // Other common categories
  photo: "camera",
  style: "palette",
  setting: "cog",
};

// Color mapping for different color names
const COLOR_MAP: Record<string, string> = {
  // Basic colors
  black: "#000000",
  white: "#FFFFFF",
  
  // Blues
  blue: "#1E88E5",
  navy: "#0D47A1",
  lightblue: "#64B5F6",
  darkblue: "#0D47A1",
  skyblue: "#4FC3F7",
  teal: "#009688",
  cyan: "#00BCD4",
  turquoise: "#00BCD4",
  
  // Reds
  red: "#E53935",
  darkred: "#B71C1C",
  lightred: "#EF5350",
  maroon: "#B71C1C",
  crimson: "#D32F2F",
  
  // Greens
  green: "#43A047",
  darkgreen: "#2E7D32",
  lightgreen: "#81C784",
  olive: "#827717",
  lime: "#C0CA33",
  
  // Yellows/Oranges
  yellow: "#FDD835",
  gold: "#FFD600",
  amber: "#FFB300",
  orange: "#FB8C00",
  darkorange: "#E65100",
  
  // Purples/Pinks
  purple: "#8E24AA",
  darkpurple: "#6A1B9A",
  lightpurple: "#AB47BC",
  violet: "#9575CD",
  magenta: "#D500F9",
  pink: "#EC407A",
  lightpink: "#F48FB1",
  
  // Browns
  brown: "#795548",
  darkbrown: "#5D4037",
  lightbrown: "#A1887F",
  tan: "#D7CCC8",
  beige: "#F5F5DC",
  
  // Grays
  gray: "#757575",
  grey: "#757575",
  darkgray: "#424242",
  darkgrey: "#424242",
  lightgray: "#BDBDBD",
  lightgrey: "#BDBDBD",
  silver: "#9E9E9E",
  charcoal: "#424242",
};

type PickerProp = {
  name: string;
  value: string;
};

type CustomPickerProps = {
  options: PickerProp[];
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
  category?: "outfit" | "color" | "general";
  relatedValue?: string; // For color picker to know which outfit is selected
};

const CustomPicker = ({
  options,
  selectedValue,
  onValueChange,
  category = "general",
  relatedValue,
}: CustomPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState(selectedValue);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  
  // Create animation refs for list items
  // We need to create these outside of renderItem to avoid hook errors
  const itemFadeAnims = useRef<Animated.Value[]>([]);
  const itemTranslateAnims = useRef<Animated.Value[]>([]);
  const shimmerAnims = useRef<Animated.Value[]>([]);
  
  // Initialize animation values for each option
  React.useEffect(() => {
    // Reset animation arrays when options change
    itemFadeAnims.current = options.map(() => new Animated.Value(0));
    itemTranslateAnims.current = options.map(() => new Animated.Value(20));
    shimmerAnims.current = options.map(() => new Animated.Value(-100));
  }, [options]);
  
  // Handle animations for selected item
  React.useEffect(() => {
    // Start shimmer animation for selected item
    const selectedIndex = options.findIndex(opt => opt.value === tempValue);
    if (selectedIndex >= 0 && shimmerAnims.current[selectedIndex]) {
      Animated.loop(
        Animated.timing(shimmerAnims.current[selectedIndex], {
          toValue: 300,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [tempValue, options]);
  
  // Create the spin animation interpolation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });
  
  const selectedOption = options.find(option => option.value === selectedValue);
  
  // Get appropriate icon for an option
  const getIconForOption = (name: string): any => {
    const lowerName = name.toLowerCase();
    
    // Check for keywords in the option name
    for (const [keyword, icon] of Object.entries(OPTION_ICONS)) {
      if (lowerName.includes(keyword)) {
        return icon;
      }
    }
    
    return OPTION_ICONS.default;
  };
  
  // Get color for a color option
  const getColorForOption = (name: string): string => {
    if (!name) return "#CCCCCC"; // Default gray if no name
    
    const lowerName = name.toLowerCase();
    
    // First try exact matches
    for (const [keyword, color] of Object.entries(COLOR_MAP)) {
      if (lowerName === keyword) {
        return color;
      }
    }
    
    // Then try partial matches
    for (const [keyword, color] of Object.entries(COLOR_MAP)) {
      if (lowerName.includes(keyword)) {
        return color;
      }
    }
    
    // Special cases for common color descriptions
    if (lowerName.includes('dark') && lowerName.includes('blue')) return '#0D47A1';
    if (lowerName.includes('light') && lowerName.includes('blue')) return '#64B5F6';
    if (lowerName.includes('dark') && lowerName.includes('green')) return '#2E7D32';
    if (lowerName.includes('light') && lowerName.includes('green')) return '#81C784';
    
    return "#CCCCCC"; // Default gray if no match
  };
  
  const handleOpen = () => {
    setTempValue(selectedValue);
    setModalVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
    
    // Start animations for list items with staggered delay
    options.forEach((_, index) => {
      const itemAnimationDelay = index * 50;
      Animated.parallel([
        Animated.timing(itemFadeAnims.current[index], {
          toValue: 1,
          duration: 300,
          delay: itemAnimationDelay,
          useNativeDriver: true,
        }),
        Animated.timing(itemTranslateAnims.current[index], {
          toValue: 0,
          duration: 300,
          delay: itemAnimationDelay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start();
    });
  };
  
  const handleClose = () => {
    // Reverse animations and close modal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(spinValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setModalVisible(false);
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const handleSelect = (value: string) => {
    setTempValue(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const handleConfirm = () => {
    onValueChange(tempValue);
    handleClose();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const renderItem = ({ item, index }: { item: PickerProp, index: number }) => {
    const isSelected = item.value === tempValue;
    const iconName = getIconForOption(item.name);
    
    // Use the pre-created animation values
    const itemFadeAnim = itemFadeAnims.current[index] || new Animated.Value(0);
    const itemTranslateAnim = itemTranslateAnims.current[index] || new Animated.Value(0);
    const shimmerAnim = shimmerAnims.current[index] || new Animated.Value(-100);
    
    // Render color swatch if this is a color picker
    if (category === "color") {
      const colorValue = getColorForOption(item.name);
      
      // Find the related outfit option
      const relatedOutfitOption = relatedValue ? options.find(opt => opt.value === relatedValue) : null;
      const relatedOutfitName = relatedOutfitOption?.name || "";
      const outfitIconName = getIconForOption(relatedOutfitName);
      
      return (
        <Animated.View
          style={{
            opacity: itemFadeAnim,
            transform: [{ translateY: itemTranslateAnim }]
          }}
        >
          <TouchableOpacity
            style={[
              styles.optionItem,
              isSelected && styles.selectedItem
            ]}
            onPress={() => handleSelect(item.value)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={isSelected ? 
                [COLORS.primaryDark, COLORS.primary] : 
                ['#333333', '#2a2a2a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            
            {/* Shimmer effect for selected item */}
            {isSelected && (
              <View style={styles.shimmerContainer}>
                <Animated.View 
                  style={[
                    styles.shimmer,
                    {
                      transform: [
                        { skewX: '-20deg' }, 
                        { translateX: shimmerAnim }
                      ]
                    }
                  ]} 
                />
              </View>
            )}
            
            <View style={styles.optionContent}>
              {/* Show the selected outfit icon in the selected color */}
              {relatedValue && relatedOutfitName && (
                <View style={styles.colorIconContainer}>
                  <MaterialCommunityIcons 
                    name={outfitIconName}
                    size={22}
                    color={colorValue}
                    style={styles.optionIcon}
                  />
                </View>
              )}
              
              {/* Color swatch */}
              <View 
                style={[
                  styles.colorSwatch, 
                  { backgroundColor: colorValue }
                ]} 
              />
              <Text style={styles.optionText}>{item.name}</Text>
            </View>
            
            {isSelected && (
              <Ionicons name="checkmark-circle" size={22} color={COLORS.primaryLight} />
            )}
          </TouchableOpacity>
        </Animated.View>
      );
    }
    
    // Render outfit option
    return (
      <Animated.View
        style={{
          opacity: itemFadeAnim,
          transform: [{ translateY: itemTranslateAnim }]
        }}
      >
        <TouchableOpacity
          style={[
            styles.optionItem,
            isSelected && styles.selectedItem
          ]}
          onPress={() => handleSelect(item.value)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={isSelected ? 
              [COLORS.primaryDark, COLORS.primary] : 
              ['#333333', '#2a2a2a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          
          {/* Shimmer effect for selected item */}
          {isSelected && (
            <View style={styles.shimmerContainer}>
              <Animated.View 
                style={[
                  styles.shimmer,
                  {
                    transform: [
                      { skewX: '-20deg' }, 
                      { translateX: shimmerAnim }
                    ]
                  }
                ]} 
              />
            </View>
          )}
          
          <View style={styles.optionContent}>
            <MaterialCommunityIcons 
              name={iconName} 
              size={22} 
              color={isSelected ? COLORS.primaryLight : COLORS.text} 
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>{item.name}</Text>
          </View>
          
          {isSelected && (
            <Ionicons name="checkmark-circle" size={22} color={COLORS.primaryLight} />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  return (
    <>
      <Pressable
        style={styles.pickerButton}
        onPress={handleOpen}
      >
        <LinearGradient
          colors={[COLORS.background, `${COLORS.background}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.pickerButtonContent}>
          {category === "color" ? (
            <>
              {/* For color picker, show color swatch */}
              <View 
                style={[
                  styles.colorSwatch, 
                  { backgroundColor: getColorForOption(selectedOption?.name || "") }
                ]} 
              />
              {/* If we have a related outfit, show its icon in this color */}
              {relatedValue && (
                <View style={styles.outfitIconInColor}>
                  <MaterialCommunityIcons 
                    name={getIconForOption(options.find(opt => opt.value === relatedValue)?.name || "")}
                    size={20}
                    color={getColorForOption(selectedOption?.name || "")}
                    style={styles.pickerButtonIcon}
                  />
                </View>
              )}
            </>
          ) : (
            <MaterialCommunityIcons 
              name={getIconForOption(selectedOption?.name || "")} 
              size={20} 
              color={COLORS.text}
              style={styles.pickerButtonIcon}
            />
          )}
          <Text style={styles.pickerButtonText}>
            {selectedOption?.name || "Select an option"}
        </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="chevron-down" size={20} color={COLORS.text} />
        </Animated.View>
      </Pressable>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleClose}
      >
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select an option</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close-circle" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.optionsListContent}
            />
            
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

export default CustomPicker;

const styles = StyleSheet.create({
  pickerButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    overflow: 'hidden',
  },
  pickerButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pickerButtonIcon: {
    marginRight: 8,
  },
  pickerButtonText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.overlay,
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: COLORS.modalBackground,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionsListContent: {
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    position: "relative",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIcon: {
    marginRight: 12,
  },
  selectedItem: {
    borderColor: COLORS.primaryLight,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  confirmButton: {
    margin: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  shimmer: {
    width: '200%',
    height: '100%',
    backgroundColor: COLORS.shimmer,
    position: 'absolute',
    top: 0,
    opacity: 0.5,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  colorIconContainer: {
    marginRight: 8,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outfitIconInColor: {
    marginLeft: 8,
    marginRight: 4,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
  },
});
