import { createStackNavigator } from "@react-navigation/stack";
import DashboardStyles from "./dashboardStyles";
import StyleImagesScreen from "./styleImages";
import ProjectsList from "./projectsList";
export type Style = {
  id: string;
  name: string;
  outfit: string;
  outfitColor: string;
  images: string[];
  thumbnails: string[];
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
  StyleImages: { style: Style };
};

const Stack = createStackNavigator<RootStackParamList>();
const ProjectStack = () => {
  return (
    <Stack.Navigator
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
        component={ProjectsList}
        options={{ title: "Projects" }}
      />
      <Stack.Screen
        name="Styles"
        component={DashboardStyles}
        options={{ title: "My Styles" }}
      />
      <Stack.Screen
        name="StyleImages"
        component={StyleImagesScreen}
        options={({ route }) => ({
          title: route.params.style.name,
        })}
      />
    </Stack.Navigator>
  );
};

export default ProjectStack;
