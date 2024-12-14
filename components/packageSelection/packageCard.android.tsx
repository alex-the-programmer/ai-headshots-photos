import { PackageCardFragment } from "@/generated/graphql";
import PackageCardInternal from "./packageCardInternal";

const PackageCard = ({
  packageNode,
  projectId,
}: {
  packageNode: PackageCardFragment;
  projectId: string;
}) => {
  const onPress = () => {
    console.log("onPress");
  };
  return <PackageCardInternal packageNode={packageNode} onPress={onPress} />;
};

export default PackageCard;
