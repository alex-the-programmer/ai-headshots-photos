import { createStackNavigator } from "@react-navigation/stack";
import DashboardStyles from "./dashboardStyles";
import StyleImagesScreen from "./styleImages";
import ProjectsList from "./projectsList";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { DashboardStylesFragment, ProjectCardFragment } from "@/generated/graphql";
import { ProjectsNavigationProp } from "@/types/navigation";

export type Style = {
  id: string;
  name: string;
  outfit: string;
  outfitColor: string;
  images: string[];
  thumbnails: string[];
  nameWithProperties?: string;
};

export type Project = {
  id: string;
  createdAt: string;
  status: string;
  thumbnails: string[];
};

export type RootStackParamList = {
  Projects: undefined;
  Styles: { projectId: string };
  StyleImages: { style: DashboardStylesFragment };
};

// Create a wrapper component for ProjectsList that doesn't require props
const ProjectsListWrapper = (props: any) => {
  return <ProjectsList projects={[]} navigation={props.navigation as ProjectsNavigationProp} />;
};

const Stack = createStackNavigator<RootStackParamList>();

const ProjectStack = () => {
  // Get the params from the URL
  const params = useLocalSearchParams();
  const projectId = params.projectId as string;
  const initialScreen = params.initialScreen as keyof RootStackParamList | undefined;
  
  // Log the params for debugging
  useEffect(() => {
    console.log("ProjectStack - Params:", params);
    console.log("ProjectStack - Project ID:", projectId);
    console.log("ProjectStack - Initial Screen:", initialScreen);
  }, [params, projectId, initialScreen]);

  return (
    <Stack.Navigator
      initialRouteName={initialScreen || "Projects"}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#14142B",
        },
        headerTintColor: "#fff", // This colors the back button and title
        headerTitleStyle: {
          color: "#fff",
        },
      }}
    >
      <Stack.Screen
        name="Projects"
        component={ProjectsListWrapper}
        options={{
          title: "My Projects",
          headerLeft: () => null, // This will hide the back button
        }}
      />
      <Stack.Screen
        name="Styles"
        component={DashboardStyles}
        initialParams={{ projectId }}
        options={{ title: "Project Styles" }}
      />
      <Stack.Screen
        name="StyleImages"
        component={StyleImagesScreen}
        options={({ route }) => ({
          title: route.params.style.nameWithProperties || "Style Images",
        })}
      />
    </Stack.Navigator>
  );
};

export default ProjectStack;
