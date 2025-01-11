import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Card from "@/components/common/card";
import CircularAvatar from "@/components/common/circularAvatar";
import IntoCard from "../common/intoCard";
import { DashboardStylesFragment } from "@/generated/graphql";
import { gql } from "@apollo/client";

type Style = {
  id: string;
  name: string;
  outfit: string;
  outfitColor: string;
  images: string[];
  thumbnails: string[];
};

type StyleCardProps = {
  style: DashboardStylesFragment;
  onPress: () => void;
};

const StyleCardText = ({ style }: { style: DashboardStylesFragment }) => (
  <>
    <Text style={[styles.styleName, styles.whiteText]}>
      {style.nameWithProperties}
    </Text>
  </>
);

export const StyleCard = ({ style, onPress }: StyleCardProps) => (
  <IntoCard
    onPress={onPress}
    thumbnails={
      style.generatedImages?.nodes
        ?.map((image) => image.thumbnailUrl)
        .slice(0, 2) || []
    }
  >
    <StyleCardText style={style} />
  </IntoCard>
);

const styles = StyleSheet.create({
  styleName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  whiteText: {
    color: "white",
  },
});

export default StyleCard;

const DASHBOARD_STYLES_FRAGMENT = gql`
  fragment dashboardStyles on ProjectStyle {
    id
    nameWithProperties
    generatedImages {
      nodes {
        id
        originalUrl
        thumbnailUrl
      }
    }
  }
`;
