import { UIFieldServerComponent, UIFieldServerProps } from "payload";
import RefreshClerkDataButton from "./refresh-clerk-data-button";

export const RefreshClerkDataButtonField: UIFieldServerComponent = async ({
  data,
}: UIFieldServerProps) => {
  return <RefreshClerkDataButton clerkUserId={data.clerkUserId} />;
};

export default RefreshClerkDataButtonField;
