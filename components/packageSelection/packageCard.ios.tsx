import {
  OrderProcessingStatusEnum,
  PackageCardFragment,
  useChoosePackageMutation,
  useVerifyApplePaymentMutation,
} from "@/generated/graphql";
import PackageCardInternal from "./packageCardInternal";

import Constants from "expo-constants";
import { gql } from "@apollo/client";
import { useRouter } from "expo-router";

const PackageCard = ({
  packageNode,
  projectId,
}: {
  packageNode: PackageCardFragment;
  projectId: string;
}) => {
  const router = useRouter();
  const [choosePackage] = useChoosePackageMutation();
  const [verifyApplePayment] = useVerifyApplePaymentMutation();
  const onPress = async () => {
    try {
      console.log("PackageCard: onPress started", {
        packageId: packageNode.id,
        projectId,
      });

      if (Constants.appOwnership === "expo") {
        console.log("PackageCard: Running in Expo Go");
        const choosePackageResult = await choosePackage({
          variables: {
            projectId: projectId,
            packageId: packageNode.id,
          },
        });
        console.log("PackageCard: choosePackage result", choosePackageResult);

        const verifyApplePaymentResult = await verifyApplePayment({
          variables: {
            orderId:
              choosePackageResult.data?.choosePackage?.project?.lastOrder?.id ??
              "",
          },
        });
        console.log(
          "PackageCard: verifyApplePayment result",
          verifyApplePaymentResult
        );

        if (
          verifyApplePaymentResult.data?.verifyApplePayment?.order
            ?.processingStatus === OrderProcessingStatusEnum.PaymentProcessed
        ) {
          console.log(
            "PackageCard: Payment processed successfully, navigating to stylesSelection"
          );
          router.push({
            pathname: "/stylesSelection",
            params: {
              projectId: projectId,
            },
          });
        } else {
          console.log("PackageCard: Payment not processed", {
            status:
              verifyApplePaymentResult.data?.verifyApplePayment?.order
                ?.processingStatus,
          });
        }
        return;
      }

      console.log("PackageCard: Starting IAP flow");
      const InAppPurchases = await import("expo-in-app-purchases");
      await InAppPurchases.connectAsync();

      // Set up the purchase listener before initiating the purchase
      const purchasePromise = new Promise((resolve, reject) => {
        InAppPurchases.setPurchaseListener(
          async ({ responseCode, results, errorCode }) => {
            console.log("PackageCard: Purchase listener response", {
              responseCode,
              errorCode,
              results,
            });

            try {
              switch (responseCode) {
                case InAppPurchases.IAPResponseCode.OK:
                case InAppPurchases.IAPResponseCode.DEFERRED:
                  console.log(
                    "PackageCard: Purchase successful, finishing transaction"
                  );
                  if (results && results[0]) {
                    await InAppPurchases.finishTransactionAsync(
                      results[0],
                      true
                    );
                  }
                  await InAppPurchases.disconnectAsync();
                  resolve(true);
                  break;
                case InAppPurchases.IAPResponseCode.USER_CANCELED:
                  console.log("PackageCard: Purchase cancelled by user");
                  await InAppPurchases.disconnectAsync();
                  resolve(false);
                  break;
                default:
                  console.log("PackageCard: Purchase failed", { errorCode });
                  await InAppPurchases.disconnectAsync();
                  reject(new Error(`Purchase failed: ${errorCode}`));
              }
            } catch (error) {
              console.error("PackageCard: Error in purchase listener", error);
              reject(error);
            }
          }
        );
      });

      console.log("PackageCard: Connected to IAP, initiating purchase", {
        productId: packageNode.appleProductId,
      });

      // Initiate the purchase and wait for the listener to resolve
      await InAppPurchases.purchaseItemAsync(packageNode.appleProductId);
      return await purchasePromise;
    } catch (error) {
      console.error("PackageCard: Error in onPress", error);
      throw error;
    }
  };
  return <PackageCardInternal packageNode={packageNode} onPress={onPress} />;
};

export default PackageCard;

export const CHOOSE_PACKAGE_MUTATION = gql`
  mutation ChoosePackage($projectId: ID!, $packageId: ID!) {
    choosePackage(input: { projectId: $projectId, packageId: $packageId }) {
      project {
        id
        lastOrder {
          id
          processingStatus
          package {
            id
          }
        }
      }
    }
  }
`;

export const MUTATION_VERIFY_APPLE_PAYMENT = gql`
  mutation VerifyApplePayment($orderId: ID!) {
    verifyApplePayment(input: { orderId: $orderId }) {
      order {
        id
        processingStatus
        package {
          id
        }
      }
    }
  }
`;
