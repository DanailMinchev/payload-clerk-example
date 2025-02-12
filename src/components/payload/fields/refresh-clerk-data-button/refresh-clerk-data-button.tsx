import { UIFieldServerComponent, UIFieldServerProps } from "payload";
import RefreshClerkDataButtonClient from "./refresh-clerk-data-button-client";

export const RefreshClerkDataButton: UIFieldServerComponent = async ({
  data,
}: UIFieldServerProps) => {
  return <RefreshClerkDataButtonClient clerkUserId={data.clerkUserId} />;
};

export default RefreshClerkDataButton;
