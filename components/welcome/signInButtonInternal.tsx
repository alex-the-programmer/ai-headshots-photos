import { useCreateProjectMutation } from "@/generated/graphql";
import { gql } from "@apollo/client";
import { router, useRouter } from "expo-router";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const SignInButtonInternal = ({ handlePress }: { handlePress: () => void }) => {
  const router = useRouter();
  const [createProject] = useCreateProjectMutation();
  const handlePressCommon = async () => {
    await handlePress();
    const { data: projectData } = await createProject();
    console.log("inside common", projectData);
    router.push({
      pathname: "/packageSelection",
      params: {
        projectId: projectData?.createProject?.project?.id,
      },
    });
  };
  return (
    <TouchableOpacity style={styles.button} onPress={() => handlePressCommon()}>
      <Text style={styles.buttonText}>Start Creating ✨</Text>
    </TouchableOpacity>
  );
};

export default SignInButtonInternal;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 32,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

const WELCOME_SCREEN_SIGN_IN_MUTATION = gql`
  mutation WelcomeScreenSignInWithExternalAccount(
    $input: SignInWithExternalAccountInput!
  ) {
    signInWithExternalAccount(input: $input) {
      clientMutationId
      userAuthentication {
        jwtToken
      }
    }
  }
`;

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject {
    createProject(input: {}) {
      project {
        id
      }
    }
  }
`;
