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

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {cart.orders.nodes.map((order) =>
          order.projectStyles.nodes.map((projectStyle) => (
            <SelectedStyleCard projectStyle={projectStyle} />
          ))
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    gap: 16,
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
