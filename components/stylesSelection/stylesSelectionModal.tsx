import { Style } from "@/app/projectStack";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
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

  const [selectedOutfit, setSelectedOutfit] = useState(
    outfitProperty?.propertyValues.nodes[0].id
  );
  const [selectedColor, setSelectedColor] = useState(
    outfitColorProperty?.propertyValues.nodes[0].id
  );

  const [addProjectStyle] = useAddProjectStyleMutation();

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

          <Text style={styles.labelText}>Outfit</Text>
          <View style={styles.pickerContainer}>
            <CustomPicker
              options={outfitProperty?.propertyValues.nodes.map((node) => ({
                name: node.name,
                value: node.id,
              }))}
              selectedValue={selectedOutfit}
              onValueChange={setSelectedOutfit}
            />
          </View>

          <Text style={styles.labelText}>Outfit Color</Text>
          <View style={styles.pickerContainer}>
            <CustomPicker
              options={outfitColorProperty?.propertyValues.nodes.map(
                (node) => ({
                  name: node.name,
                  value: node.id,
                })
              )}
              selectedValue={selectedColor}
              onValueChange={setSelectedColor}
            />
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton text="Back" onPress={onClose} />
            <PrimaryButton text="Add" onPress={handleAddProjectStyle} />
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
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "white",
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
    gap: 10,
    marginTop: 10,
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
