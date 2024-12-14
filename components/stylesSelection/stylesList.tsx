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
  disabled,
}: {
  availableStyles: StyleStyleSelectionCardFragment[];
  availableProperties: PropertyStyleSelectionCardFragment[];
  projectId: string;
  disabled: boolean;
}) => (
  <FlatList
    data={availableStyles}
    renderItem={({ item }) => (
      <StyleSelectionCard
        style={item}
        availableProperties={availableProperties}
        projectId={projectId}
        disabled={disabled}
      />
    )}
  />
);

export default StylesList;
