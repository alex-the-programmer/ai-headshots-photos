import { FlatList } from "react-native";
import StyleSelectionCard from "./styleSelectionCard";
import {
  PropertyStyleSelectionCardFragment,
  StyleStyleSelectionCardFragment,
} from "@/generated/graphql";

const StylesList = ({
  availableStyles,
  availableProperties,
}: {
  availableStyles: StyleStyleSelectionCardFragment[];
  availableProperties: PropertyStyleSelectionCardFragment[];
}) => (
  <FlatList
    data={availableStyles}
    renderItem={({ item }) => (
      <StyleSelectionCard
        style={item}
        availableProperties={availableProperties}
      />
    )}
  />
);

export default StylesList;
