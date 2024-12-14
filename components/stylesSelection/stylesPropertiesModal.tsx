import React from "react";
import { Modal, View, Text, StyleSheet, Image } from "react-native";
import PrimaryButton from "../common/primaryButton";
import {
  CartProjectStyleFragment,
  useDeleteProjectStyleMutation,
} from "@/generated/graphql";
import { gql } from "@apollo/client";

interface StylesPropertiesModalProps {
  visible: boolean;
  onClose: () => void;

  projectStyle: CartProjectStyleFragment;
}

const StylesPropertiesModal = ({
  visible,
  onClose,
  projectStyle,
}: StylesPropertiesModalProps) => {
  if (!projectStyle) return null;

  const [deleteProjectStyle] = useDeleteProjectStyleMutation();

  const onDelete = () => {
    deleteProjectStyle({
      variables: {
        projectStyleId: projectStyle.id,
      },
    });
    onClose();
  };

  const outfit = projectStyle.projectStyleProperties.nodes.find(
    (property) => property.property.name === "Outfit"
  );

  const outfitColor = projectStyle.projectStyleProperties.nodes.find(
    (property) => property.property.name === "Outfit Color"
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Style Properties</Text>

          <Image
            source={{ uri: projectStyle.style.logo }}
            style={styles.previewImage}
          />

          <View style={styles.propertyContainer}>
            <Text style={styles.label}>Style name</Text>
            <Text style={styles.value}>{projectStyle.style.name}</Text>
          </View>

          <View style={styles.propertyContainer}>
            <Text style={styles.label}>Outfit</Text>
            <Text style={styles.value}>
              {outfit?.propertyValue?.name || "Not specified"}
            </Text>
          </View>

          <View style={styles.propertyContainer}>
            <Text style={styles.label}>Outfit Color</Text>
            <Text style={styles.value}>
              {outfitColor?.propertyValue?.name || "Not specified"}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton text="Back" onPress={onClose} />
            <PrimaryButton
              text="Delete"
              onPress={onDelete}
              style={styles.deleteButton}
              textStyle={styles.deleteButtonText}
            />
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
    width: "90%",
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  propertyContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "white",
  },
  value: {
    fontSize: 16,
    color: "#999",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  deleteButtonText: {
    color: "white",
  },
});

export default StylesPropertiesModal;

export const MUTATION_DELETE_PROJECT_STYLE = gql`
  mutation deleteProjectStyle($projectStyleId: ID!) {
    deleteProjectStyle(input: { projectStyleId: $projectStyleId }) {
      project {
        ...cart
      }
    }
  }
`;
