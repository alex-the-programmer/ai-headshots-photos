import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DashboardStylesFragment } from "@/generated/graphql";

export type RootStackParamList = {
  Projects: undefined;
  Styles: {
    projectId: string;
  };
  StyleImages: {
    style: DashboardStylesFragment;
  };
};

export type ProjectsNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
