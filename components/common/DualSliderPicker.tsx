import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Animated,
  Dimensions
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

// Define type for MaterialCommunityIcons names
type MaterialCommunityIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Icon mapping for different option types
const OPTION_ICONS: Record<string, MaterialCommunityIconName> = {
  // Default icon if no specific mapping is found
  default: "tshirt-crew-outline",
  
  // Clothing/Outfit related - Expanded set
  // Formal wear
  suit: "tie",
  tuxedo: "bow-tie",
  formal: "hanger",
  business: "briefcase",
  professional: "account-tie",
  blazer: "hanger",
  
  // Casual wear
  casual: "tshirt-crew",
  shirt: "tshirt-v",
  tshirt: "tshirt-crew",
  polo: "tshirt-v-outline",
  tank: "tshirt-crew-outline",
  
  // Outerwear
  jacket: "hanger",
  hoodie: "zip-box",
  sweater: "hanger",
  cardigan: "hanger",
  coat: "weather-snowy",
  raincoat: "weather-pouring",
  
  // Bottoms
  pants: "archive",
  jeans: "archive-outline",
  shorts: "archive-arrow-down",
  skirt: "triangle",
  
  // Dresses
  dress: "human-female",
  gown: "human-female",
  
  // Sportswear
  athletic: "run-fast",
  gym: "weight-lifter",
  yoga: "human-handsup",
  swimwear: "swim",
  
  // Sleepwear
  pajamas: "sleep",
  robe: "bathtub",
  
  // Accessories
  hat: "hat-fedora",
  cap: "baseball",
  scarf: "hanger",
  gloves: "hand-front-right",
  
  // Footwear
  shoes: "shoe-formal",
  boots: "shoe-heel",
  sneakers: "shoe-sneaker",
  sandals: "shoe-cleat",
  
  // Styles
  vintage: "clock-time-eight-outline",
  modern: "timeline",
  classic: "crown",
  trendy: "trending-up",
  bohemian: "flower",
  minimalist: "minus-box",
  
  // Colors
  black: "circle",
  white: "circle-outline",
  blue: "water",
  lightblue: "water-outline",
  navy: "shield",
  red: "heart",
  darkred: "heart-outline",
  green: "leaf",
  lightgreen: "leaf-maple",
  gray: "circle-medium",
  grey: "circle-medium",
  darkgray: "circle-slice-8",
  darkgrey: "circle-slice-8",
  brown: "coffee",
  tan: "coffee-outline",
  beige: "checkbox-blank-circle-outline",
  purple: "flower-tulip",
  pink: "flower",
  yellow: "star",
  gold: "star-outline",
  orange: "fire",
  silver: "silverware-variant",
  
  // Gender
  male: "gender-male",
  female: "gender-female",
  unisex: "gender-male-female",
  
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

type DualSliderPickerProps = {
  colorOptions: PickerProp[];
  outfitOptions: PickerProp[];
  selectedColor: string;
  selectedOutfit: string;
  onColorChange: (itemValue: string) => void;
  onOutfitChange: (itemValue: string) => void;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DualSliderPicker = ({
  colorOptions,
  outfitOptions,
  selectedColor,
  selectedOutfit,
  onColorChange,
  onOutfitChange,
}: DualSliderPickerProps) => {
  // Animation refs for list items
  const colorItemAnims = useRef<Animated.Value[]>([]);
  const outfitItemAnims = useRef<Animated.Value[]>([]);
  
  // Initialize animation values for each option
  useEffect(() => {
    colorItemAnims.current = colorOptions.map(() => new Animated.Value(1));
    outfitItemAnims.current = outfitOptions.map(() => new Animated.Value(1));
  }, [colorOptions, outfitOptions]);
  
  const selectedColorOption = colorOptions.find(option => option.value === selectedColor);
  const selectedOutfitOption = outfitOptions.find(option => option.value === selectedOutfit);
  
  // Get appropriate icon for an option
  const getIconForOption = (name: string): MaterialCommunityIconName => {
    if (!name) return OPTION_ICONS.default;
    
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
  
  const handleColorSelect = (value: string) => {
    onColorChange(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const handleOutfitSelect = (value: string) => {
    onOutfitChange(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const renderColorItem = ({ item, index }: { item: PickerProp, index: number }) => {
    const isSelected = item.value === selectedColor;
    const colorValue = getColorForOption(item.name);
    
    return (
      <Animated.View
        style={{
          opacity: colorItemAnims.current[index] || new Animated.Value(1),
          transform: [{ scale: isSelected ? 1.05 : 1 }]
        }}
      >
        <TouchableOpacity
          style={[
            styles.colorItem,
            isSelected && styles.selectedItem
          ]}
          onPress={() => handleColorSelect(item.value)}
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
          
          {/* Color swatch */}
          <View 
            style={[
              styles.colorSwatch, 
              { backgroundColor: colorValue }
            ]} 
          />
          
          <Text style={styles.itemText} numberOfLines={2}>{item.name}</Text>
          
          {isSelected && (
            <Ionicons name="checkmark-circle" size={18} color={COLORS.primaryLight} />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const renderOutfitItem = ({ item, index }: { item: PickerProp, index: number }) => {
    const isSelected = item.value === selectedOutfit;
    const iconName = getIconForOption(item.name);
    const selectedColorValue = getColorForOption(
      colorOptions.find(opt => opt.value === selectedColor)?.name || ""
    );
    
    return (
      <Animated.View
        style={{
          opacity: outfitItemAnims.current[index] || new Animated.Value(1),
          transform: [{ scale: isSelected ? 1.05 : 1 }]
        }}
      >
        <TouchableOpacity
          style={[
            styles.outfitItem,
            isSelected && styles.selectedItem
          ]}
          onPress={() => handleOutfitSelect(item.value)}
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
          
          <View style={styles.outfitIconContainer}>
            <MaterialCommunityIcons 
              name={iconName} 
              size={22} 
              color={isSelected ? selectedColorValue : COLORS.text} 
            />
          </View>
          
          <Text style={styles.itemText} numberOfLines={2}>{item.name}</Text>
          
          {isSelected && (
            <Ionicons name="checkmark-circle" size={18} color={COLORS.primaryLight} />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Color & Outfit</Text>
      </View>
      
      <View style={styles.dualPickerContainer}>
        {/* Color picker column */}
        <View style={styles.pickerColumn}>
          <Text style={styles.columnTitle}>Color</Text>
          <FlatList
            data={colorOptions}
            renderItem={renderColorItem}
            keyExtractor={(item) => item.value}
            style={styles.columnList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.columnListContent}
            onScrollBeginDrag={() => Haptics.selectionAsync()}
            onMomentumScrollEnd={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />
        </View>
        
        {/* Outfit picker column */}
        <View style={styles.pickerColumn}>
          <Text style={styles.columnTitle}>Outfit</Text>
          <FlatList
            data={outfitOptions}
            renderItem={renderOutfitItem}
            keyExtractor={(item) => item.value}
            style={styles.columnList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.columnListContent}
            onScrollBeginDrag={() => Haptics.selectionAsync()}
            onMomentumScrollEnd={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />
        </View>
      </View>
      
      <View style={styles.selectionSummary}>
        <View style={styles.summaryContent}>
          {/* Color swatch */}
          <View 
            style={[
              styles.colorSwatch, 
              { backgroundColor: getColorForOption(selectedColorOption?.name || "") }
            ]} 
          />
          
          {/* Outfit icon in selected color */}
          <View style={styles.outfitIconInColor}>
            <MaterialCommunityIcons 
              name={getIconForOption(selectedOutfitOption?.name || "")}
              size={20}
              color={getColorForOption(selectedColorOption?.name || "")}
            />
          </View>
          
          <Text style={styles.summaryText} numberOfLines={1}>
            {selectedColorOption?.name || ""} {selectedOutfitOption?.name || ""}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  dualPickerContainer: {
    flexDirection: "row",
    height: 300, // Fixed height for the picker area
  },
  pickerColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: COLORS.borderColor,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  columnList: {
    flex: 1,
  },
  columnListContent: {
    paddingVertical: 8,
  },
  colorItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  outfitItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  selectedItem: {
    borderColor: COLORS.primaryLight,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  itemText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    marginHorizontal: 8,
    flexWrap: 'wrap',
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
  outfitIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outfitIconInColor: {
    marginRight: 8,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
  },
  selectionSummary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    backgroundColor: COLORS.background,
  },
  summaryContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
});

export default DualSliderPicker;