import type { UIFieldServerComponent, UIFieldServerProps } from "payload";
import RefreshClerkDataButton from "./refresh-clerk-data-button";

export const RefreshClerkDataButtonField: UIFieldServerComponent = async ({
  data,
}: UIFieldServerProps) => {
  if (typeof data?.clerkUserId !== "string") {
    return null;
  }

  return <RefreshClerkDataButton clerkUserId={data.clerkUserId} />;
};

export default RefreshClerkDataButtonField;
