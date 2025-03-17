import {
  OrderProcessingStatusEnum,
  PackageCardFragment,
  useChoosePackageMutation,
} from "@/generated/graphql";
import PackageCardInternal from "./packageCardInternal";

import Constants from "expo-constants";
import * as Device from "expo-device";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import { useRouter } from "expo-router";
import { ActivityIndicator, View, Platform } from "react-native";
import { useState, useEffect } from "react";

const PackageCard = ({
  packageNode,
  projectId,
  onProcessingStateChange,
  disabled = false,
}: {
  packageNode: PackageCardFragment;
  projectId: string;
  onProcessingStateChange?: (isProcessing: boolean) => void;
  disabled?: boolean;
}) => {
  const APPLE_API_KEY = "appl_hMinwDlbtbTEqXXBeDyomsQqJdr";
  const router = useRouter();
  const [choosePackage] = useChoosePackageMutation();

  const [isPolling, setIsPolling] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const client = useApolloClient();

  const isSimulator = !Device.isDevice;

  // Notify parent component when processing state changes
  useEffect(() => {
    if (onProcessingStateChange) {
      onProcessingStateChange(isProcessing);
    }
  }, [isProcessing, onProcessingStateChange]);

  const pollPurchaseResults = async () => {
    setIsPolling(true);
    const pollInterval = 2000; // 2 seconds

    const checkStatus = async () => {
      try {
        const result = await client.query({
          query: CHECK_PURCHASE_STATUS_QUERY,
          variables: { projectId },
          fetchPolicy: "network-only",
        });

        const status =
          result.data?.currentUser?.project?.lastOrder?.processingStatus;

        if (status && status !== OrderProcessingStatusEnum.Created) {
          setIsPolling(false);
          setIsProcessing(false);
          if (status === OrderProcessingStatusEnum.PaymentProcessed) {
            router.push({
              pathname: "/stylesSelection",
              params: {
                projectId,
              },
            });
          }
          return;
        }

        // Continue polling
        setTimeout(checkStatus, pollInterval);
      } catch (error) {
        console.error("Error polling purchase status:", error);
        setIsPolling(false);
        setIsProcessing(false);
      }
    };

    checkStatus();
  };

  const onPress = async () => {
    // If already processing or disabled by parent, ignore click
    if (isProcessing || disabled) {
      console.log("PackageCard: Purchase already in progress or disabled, ignoring click");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      if (isSimulator) {
        console.log("PackageCard: Running in simulator, bypassing package selection");
        try {
          const choosePackageResult = await choosePackage({
            variables: {
              projectId: projectId,
              packageId: packageNode.id,
            },
          });
          
          console.log("PackageCard: Choose package result in simulator", choosePackageResult);
          
          router.push({
            pathname: "/stylesSelection",
            params: {
              projectId,
            },
          });
          return;
        } catch (error) {
          console.error("Error in simulator flow:", error);
          setIsProcessing(false);
        }
      }
      
      if (Constants.appOwnership !== "expo") {
        const Purchases = (await import("react-native-purchases")).default;
        console.log("PackageCard: App ownership is not Expo, setting debug logs");

        // Configure RevenueCat SDK first
        try {
          console.log("PackageCard: Choosing package");
          const choosePackageResult = await choosePackage({
            variables: {
              projectId: projectId,
              packageId: packageNode.id,
            },
          });

          console.log("PackageCard: Choose package result", choosePackageResult);

          console.log("Configuring RevenueCat");
          await Purchases.configure({
            apiKey: APPLE_API_KEY,
            appUserID:
              choosePackageResult.data?.choosePackage?.project?.lastOrder?.id,
          });
          Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);

          // Log RevenueCat configuration
          console.log("PackageCard: RevenueCat configured");

          // Get customer info first
          const customerInfo = await Purchases.getCustomerInfo();
          console.log("PackageCard: Customer info", customerInfo);

          // Log the product ID we're looking for
          console.log(
            "PackageCard: Looking for product ID:",
            packageNode.appleProductId
          );

          // Get specific product
          const products = await Purchases.getProducts([
            packageNode.appleProductId,
          ]);
          console.log("PackageCard: Retrieved products:", products);

          if (!products || products.length === 0) {
            console.error("PackageCard: No products found. Please check:");
            console.error("1. Product ID matches App Store Connect");
            console.error("2. Product is active in App Store Connect");
            console.error("3. Product is properly configured in RevenueCat");
            setIsProcessing(false);
            return;
          }

          const productToBuy = products.find(
            (p) => p.identifier === packageNode.appleProductId
          );
          console.log("PackageCard: Product to buy", productToBuy);

          if (!productToBuy) {
            console.log("PackageCard: No package to buy");
            setIsProcessing(false);
            return;
          }

          console.log("PackageCard: Purchasing product");
          const result = await Purchases.purchaseStoreProduct(productToBuy);
          console.log("PackageCard: Purchase result", result);

          console.log("Starting polling");
          pollPurchaseResults();
        } catch (error: any) {
          console.error("RevenueCat Error:", {
            message: error?.message,
            code: error?.code,
            info: error?.info,
            underlyingError: error?.underlyingError,
          });
          setIsProcessing(false);
        }
      } else {
        console.log("PackageCard: App ownership is Expo, choosing package");
        try {
          const choosePackageResult = await choosePackage({
            variables: {
              projectId: projectId,
              packageId: packageNode.id,
            },
          });
          setIsProcessing(false);
        } catch (error) {
          console.error("Error in Expo flow:", error);
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error("Unexpected error in onPress:", error);
      setIsProcessing(false);
    }
  };

  // Determine if this card should be disabled
  const isDisabled = isPolling || isProcessing || disabled;

  return <PackageCardInternal packageNode={packageNode} onPress={onPress} disabled={isDisabled} />;
};

export default PackageCard;

export const CHECK_PURCHASE_STATUS_QUERY = gql`
  query CheckPurchaseStatus($projectId: ID!) {
    currentUser {
      id
      project(projectId: $projectId) {
        id
        lastOrder {
          id
          processingStatus
        }
      }
    }
  }
`;

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
