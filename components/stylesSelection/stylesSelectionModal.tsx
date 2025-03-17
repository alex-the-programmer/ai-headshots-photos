import { Style } from "@/app/projectStack";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import PrimaryButton from "../common/primaryButton";
import {
  PropertyStyleSelectionCardFragment,
  StyleStyleSelectionCardFragment,
  useAddProjectStyleMutation,
} from "@/generated/graphql";
import { gql } from "@apollo/client";
import CustomPicker from "../common/picker";
import DualSliderPicker from "../common/DualSliderPicker";
import { LinearGradient } from "expo-linear-gradient";

// Define consistent colors
const COLORS = {
  primary: '#6C5CE7',         // Main purple color
  primaryLight: '#8A7EFF',    // Lighter purple accent
  primaryDark: '#5546D3',     // Darker purple accent
  accent: '#7c3aed',          // Bright purple accent
  text: '#FFFFFF',            // White text
};

// Define the picker option type
type PickerOption = {
  name: string;
  value: string;
};

interface StylesSelectionModalProps {
  visible: boolean;
  style: StyleStyleSelectionCardFragment | null;
  properties: PropertyStyleSelectionCardFragment[];
  onClose: () => void;
  projectId: string;
}

const StylesSelectionModal = ({
  visible,
  style,
  properties,
  onClose,
  projectId,
}: StylesSelectionModalProps) => {
  if (!style) return null;

  const outfitProperty = properties.find(
    (property) => property.name === "Outfit"
  );

  const outfitColorProperty = properties.find(
    (property) => property.name === "Outfit Color"
  );

  const [selectedOutfit, setSelectedOutfit] = useState<string>(
    outfitProperty?.propertyValues.nodes[0]?.id || ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    outfitColorProperty?.propertyValues.nodes[0]?.id || ""
  );

  const [addProjectStyle] = useAddProjectStyleMutation();

  // Convert property values to picker options
  const outfitOptions: PickerOption[] = outfitProperty?.propertyValues.nodes.map((node) => ({
    name: node.name,
    value: node.id,
  })) || [];

  const colorOptions: PickerOption[] = outfitColorProperty?.propertyValues.nodes.map((node) => ({
    name: node.name,
    value: node.id,
  })) || [];

  const handleAddProjectStyle = async () => {
    if (selectedOutfit && selectedColor) {
      await addProjectStyle({
        variables: {
          projectId: projectId,
          styleId: style.id,
          propertyValueIds: [selectedOutfit, selectedColor],
        },
      });
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{style.name}</Text>

          <Text style={styles.labelText}>Select Outfit & Color</Text>
          <View style={styles.pickerContainer}>
            <DualSliderPicker
              colorOptions={colorOptions}
              outfitOptions={outfitOptions}
              selectedColor={selectedColor}
              selectedOutfit={selectedOutfit}
              onColorChange={setSelectedColor}
              onOutfitChange={setSelectedOutfit}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={onClose}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.primaryDark, COLORS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleAddProjectStyle}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    margin: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 15,
  },
  labelText: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: "flex-start",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
});

export default StylesSelectionModal;

export const FRAGMENT_PROPERTY_STYLE_SELECTION_CARD = gql`
  fragment propertyStyleSelectionCard on Property {
    id
    name
    propertyValues {
      nodes {
        id
        name
      }
    }
  }
`;

export const MUTATION_ADD_PROJECT_STYLE = gql`
  mutation addProjectStyle(
    $projectId: ID!
    $styleId: ID!
    $propertyValueIds: [ID!]!
  ) {
    addProjectStyle(
      input: {
        projectId: $projectId
        styleId: $styleId
        propertyValueIds: $propertyValueIds
      }
    ) {
      project {
        id
        ...cart
      }
    }
  }
`;

// on project
// ...projectStyleSelectionCard
//
