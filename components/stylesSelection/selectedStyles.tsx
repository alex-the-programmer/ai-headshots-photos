import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import StylesPropertiesModal from "./stylesPropertiesModal";
import { useState, useRef } from "react";
import { gql } from "@apollo/client";
import { CartFragment } from "@/generated/graphql";
import SelectedStyleCard from "./selectedStyleCard";
import { LinearGradient } from "expo-linear-gradient";

const SelectedStyles = ({ cart }: { cart: CartFragment }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const scrollAnim = useRef(new Animated.Value(0)).current;

  const renderPlaceholders = (order: CartFragment['orders']['nodes'][0]) => {
    if (!order.package) return null;
    const selectedStylesCount = order.projectStyles.nodes.length;
    const totalStylesCount = order.package.stylesCount;
    const remainingStyles = totalStylesCount - selectedStylesCount;

    if (remainingStyles <= 0) return null;

    return Array(remainingStyles)
      .fill(null)
      .map((_, index) => (
        <Animated.View 
          key={`placeholder-${index}`} 
          style={[
            styles.placeholderCard,
            {
              opacity: scrollAnim.interpolate({
                inputRange: [0, 100],
                outputRange: [1, 0.7],
                extrapolate: 'clamp',
              }),
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.placeholderGradient}
          />
          <View style={styles.placeholderImage} />
          <Text style={styles.placeholderText}>
            Select {remainingStyles} {selectedStylesCount > 0 ? "more" : ""}{" "}
            style
            {remainingStyles > 1 ? "s" : ""}
          </Text>
        </Animated.View>
      ));
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollAnim } } }],
    { useNativeDriver: false }
  );

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 16,
  },
  placeholderCard: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: 90,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    padding: 8,
  },
  placeholderGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  placeholderImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  placeholderText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
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
