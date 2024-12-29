import SandBoxTabs from "@/components/custom/sandbox/layout/SandboxTabs";
import { Tab } from "./types";

const SdkTabs = (props: { tabsMap: Tab[] }) => {
  const { tabsMap } = props;
  return <SandBoxTabs tabsMap={tabsMap} />;
};

export default SdkTabs;
