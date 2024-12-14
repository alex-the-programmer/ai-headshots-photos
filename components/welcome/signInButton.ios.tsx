import {
  ExternalAccountTypeEnum,
  useWelcomeScreenSignInWithExternalAccountMutation,
} from "@/generated/graphql";
import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignInButtonInternal from "./signInButtonInternal";

const SignInButton = () => {
  const [signInWithExternalAccount] =
    useWelcomeScreenSignInWithExternalAccountMutation();
  const handlePress = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });

      const data = await signInWithExternalAccount({
        variables: {
          input: {
            externalAccountId: credential.user,
            externalAccountType: ExternalAccountTypeEnum.Apple,
          },
        },
      });
      await AsyncStorage.setItem(
        "session",
        JSON.stringify({
          jwtToken:
            data.data?.signInWithExternalAccount?.userAuthentication
              ?.jwtToken || "",
          accountId: credential.user,
        })
      );
      return true;
    } catch (e: any) {
      if (e.code === "ERR_CANCELED") {
        console.log("User canceled Apple Sign in");
      } else {
        console.error("Apple Sign in error:", e);
      }
      return false;
    }
  };
  return <SignInButtonInternal handlePress={handlePress} />;
};

export default SignInButton;
