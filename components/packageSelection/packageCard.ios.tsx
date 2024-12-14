import {
  PackageCardFragment,
  useChoosePackageMutation,
} from "@/generated/graphql";
import PackageCardInternal from "./packageCardInternal";

import Constants from "expo-constants";
import { gql } from "@apollo/client";

const PackageCard = ({
  packageNode,
  projectId,
}: {
  packageNode: PackageCardFragment;
  projectId: string;
}) => {
  console.log("inside package card", projectId);
  const [choosePackage] = useChoosePackageMutation();
  const onPress = async () => {
    if (Constants.appOwnership === "expo") {
      await choosePackage({
        variables: {
          projectId: projectId,
          packageId: packageNode.id,
        },
      });
      return;
    }
    const InAppPurchases = await import("expo-in-app-purchases");
    await InAppPurchases.connectAsync();
    InAppPurchases.purchaseItemAsync(packageNode.appleProductId);

    return await new Promise((resolve, reject) => {
      InAppPurchases.setPurchaseListener(
        async ({ responseCode, results, errorCode }) => {
          switch (responseCode) {
            case InAppPurchases.IAPResponseCode.OK:
            case InAppPurchases.IAPResponseCode.DEFERRED:
              // todo call mutation to verify purchase
              await InAppPurchases.finishTransactionAsync(
                (results ?? [])[0],
                true
              );
              await InAppPurchases.disconnectAsync();
              return resolve(true);
            case InAppPurchases.IAPResponseCode.USER_CANCELED:
              return resolve(false);
            default:
              return reject(new Error("Purchase failed" + errorCode));
          }
        }
      );
    });
  };
  return <PackageCardInternal packageNode={packageNode} onPress={onPress} />;
};

export default PackageCard;

export const CHOOSE_PACKAGE_MUTATION = gql`
  mutation ChoosePackage($projectId: ID!, $packageId: ID!) {
    choosePackage(input: { projectId: $projectId, packageId: $packageId }) {
      project {
        id
      }
    }
  }
`;
