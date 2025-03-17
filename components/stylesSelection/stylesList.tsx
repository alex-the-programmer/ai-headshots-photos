import { FlatList, StyleSheet, View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import StyleSelectionCard from "./styleSelectionCard";
import {
  PropertyStyleSelectionCardFragment,
  StyleStyleSelectionCardFragment,
  useAddProjectStyleMutation,
  StylesSelectionPageDocument
} from "@/generated/graphql";
import React, { useState } from "react";
import DualSliderPicker from "../common/DualSliderPicker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useApolloClient } from "@apollo/client";

// Define picker option type
type PickerOption = {
  name: string;
  value: string;
};

const StylesList = ({
  availableStyles,
  availableProperties,
  projectId,
  disabled,
}: {
  availableStyles: StyleStyleSelectionCardFragment[];
  availableProperties: PropertyStyleSelectionCardFragment[];
  projectId: string;
  disabled: boolean;
}) => {
  const [selectedStyle, setSelectedStyle] = useState<StyleStyleSelectionCardFragment | null>(null);
  const [addProjectStyle] = useAddProjectStyleMutation();
  const client = useApolloClient();
  
  // Find outfit and color properties
  const outfitProperty = availableProperties.find(
    (property) => property.name === "Outfit"
  );

  const outfitColorProperty = availableProperties.find(
    (property) => property.name === "Outfit Color"
  );
  
  // State for selected values
  const [selectedOutfit, setSelectedOutfit] = useState<string>(
    outfitProperty?.propertyValues.nodes[0]?.id || ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    outfitColorProperty?.propertyValues.nodes[0]?.id || ""
  );
  
  // Convert property values to picker options
  const outfitOptions: PickerOption[] = outfitProperty?.propertyValues.nodes.map((node) => ({
    name: node.name,
    value: node.id,
  })) || [];

  const colorOptions: PickerOption[] = outfitColorProperty?.propertyValues.nodes.map((node) => ({
    name: node.name,
    value: node.id,
  })) || [];
  
  // Handle style selection
  const handleStyleSelect = (styleId: string) => {
    const style = availableStyles.find(s => s.id === styleId);
    if (style) {
      setSelectedStyle(style);
    }
  };
  
  // Handle adding the style with selected properties
  const handleAddStyle = async () => {
    if (selectedStyle && selectedOutfit && selectedColor) {
      try {
        console.log("Adding style:", {
          projectId,
          styleId: selectedStyle.id,
          propertyValueIds: [selectedOutfit, selectedColor],
        });
        
        await addProjectStyle({
          variables: {
            projectId: projectId,
            styleId: selectedStyle.id,
            propertyValueIds: [selectedOutfit, selectedColor],
          },
          refetchQueries: ['StylesSelectionPage']
        });
        
        console.log("Style added successfully");
        setSelectedStyle(null);
      } catch (error) {
        console.error("Error adding style:", error);
        Alert.alert(
          "Error",
          "Failed to add style. Please try again."
        );
      }
    }
  };
  
  // Handle canceling the selection
  const handleCancel = () => {
    setSelectedStyle(null);
  };
  
  // Group styles into categories
  const groupedStyles = React.useMemo(() => {
    // This is a placeholder implementation - ideally you would have categories in your data
    // For now, we'll just create groups of 2 styles
    const groups: StyleStyleSelectionCardFragment[][] = [];
    const groupSize = 2;
    
    for (let i = 0; i < availableStyles.length; i += groupSize) {
      groups.push(availableStyles.slice(i, i + groupSize));
    }
    
    return groups;
  }, [availableStyles]);
  
  return (
    <>
      <FlatList
        data={groupedStyles}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            {item.map((style) => (
              <View key={style.id} style={styles.cardContainer}>
                <StyleSelectionCard
                  style={style}
                  availableProperties={availableProperties}
                  projectId={projectId}
                  disabled={disabled}
                  onSelect={handleStyleSelect}
                />
              </View>
            ))}
            {/* Add empty view for odd number of items to maintain grid layout */}
            {item.length % 2 !== 0 && <View style={styles.emptyCard} />}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      
      {/* Style Properties Selection */}
      {selectedStyle && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedStyle}
          onRequestClose={handleCancel}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedStyle.name}</Text>
                <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                  <Ionicons name="close-circle" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <DualSliderPicker
                colorOptions={colorOptions}
                outfitOptions={outfitOptions}
                selectedColor={selectedColor}
                selectedOutfit={selectedOutfit}
                onColorChange={setSelectedColor}
                onOutfitChange={setSelectedOutfit}
              />
              
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={handleAddStyle}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#6C5CE7', '#8A7EFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.addButtonText}>Add Style</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#444444",
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
    borderBottomColor: "#444444",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  addButton: {
    margin: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default StylesList;
