import { Button } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import {
  ExternalAccountTypeEnum,
  useWelcomeScreenSignInWithExternalAccountMutation,
} from "@/generated/graphql";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignInButtonInternal from "./signInButtonInternal";

const SignInButton = () => {
  const [signInWithExternalAccount] =
    useWelcomeScreenSignInWithExternalAccountMutation();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com",
  });

  const handlePressAndroid = async () => {
    try {
      const result = await promptAsync();

      if (result?.type === "success" && result.authentication) {
        // Get user info using the access token
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: {
              Authorization: `Bearer ${result.authentication.accessToken}`,
            },
          }
        );

        const userInfo = await userInfoResponse.json();

        // Call the mutation
        const signInResult = await signInWithExternalAccount({
          variables: {
            input: {
              externalAccountId: userInfo.id,
              externalAccountType: ExternalAccountTypeEnum.Google,
            },
          },
        });

        if (signInResult.data?.signInWithExternalAccount?.userAuthentication) {
          // Store both user info and JWT token
          console.log("signInResult", signInResult);
          await AsyncStorage.setItem("session", "bla");
        }
      } else {
        console.log("Google Sign in cancelled or failed");
      }
    } catch (e) {
      console.error("Google Sign in error:", e);
    }
  };
  return <SignInButtonInternal handlePress={handlePressAndroid} />;
};

export default SignInButton;
