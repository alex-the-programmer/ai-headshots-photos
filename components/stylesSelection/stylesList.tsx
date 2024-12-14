import { FlatList } from "react-native";
import StyleSelectionCard from "./styleSelectionCard";
import {
  PropertyStyleSelectionCardFragment,
  StyleStyleSelectionCardFragment,
} from "@/generated/graphql";

const StylesList = ({
  availableStyles,
  availableProperties,
  projectId,
}: {
  availableStyles: StyleStyleSelectionCardFragment[];
  availableProperties: PropertyStyleSelectionCardFragment[];
  projectId: string;
}) => (
  <FlatList
    data={availableStyles}
    renderItem={({ item }) => (
      <StyleSelectionCard
        style={item}
        availableProperties={availableProperties}
        projectId={projectId}
      />
    )}
  />
);

export default StylesList;
