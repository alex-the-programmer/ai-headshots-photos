import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import StylesPropertiesModal from "./stylesPropertiesModal";
import { useState } from "react";
import { gql } from "@apollo/client";
import { CartFragment } from "@/generated/graphql";
import SelectedStyleCard from "./selectedStyleCard";

const SelectedStyles = ({ cart }: { cart: CartFragment }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderPlaceholders = (order) => {
    const selectedStylesCount = order.projectStyles.nodes.length;
    const totalStylesCount = order.package.stylesCount;
    const remainingStyles = totalStylesCount - selectedStylesCount;

    if (remainingStyles <= 0) return null;

    return Array(remainingStyles)
      .fill(null)
      .map((_, index) => (
        <View key={`placeholder-${index}`} style={styles.placeholderCard}>
          <View style={styles.placeholderImage} />
          <Text style={styles.placeholderText}>Select More Styles</Text>
        </View>
      ));
  };

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {cart.orders.nodes.map((order) => (
          <React.Fragment key={order.id}>
            {order.projectStyles.nodes.map((projectStyle) => (
              <SelectedStyleCard
                key={projectStyle.id}
                projectStyle={projectStyle}
              />
            ))}
            {renderPlaceholders(order)}
          </React.Fragment>
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    gap: 16,
  },
  placeholderCard: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#CCCCCC",
  },
  placeholderText: {
    fontSize: 14,
    color: "#666666",
  },
});

export default SelectedStyles;

export const FRAGMENT_CART = gql`
  fragment cart on Project {
    id
    processingStatus
    orders {
      nodes {
        id
        processingStatus
        subtotal
        package {
          id
          name
          stylesCount
        }
        projectStyles {
          nodes {
            ...cartProjectStyle
          }
        }
      }
    }
  }
`;
