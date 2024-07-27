import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { LeftPanel } from "@/components/custom/sandbox/layout/mainPanels/leftPanel";
import { RightPanel } from "@/components/custom/sandbox/layout/mainPanels/rightPanel";

interface PanelManagerProps {
  type: "html" | "css" | "js" | "api" | "events";
  value: any;
  codePrefix: string;
  codePostfix: string;
  specs: any;
  onChange: (config: any) => void;
  definitions?: any;
}

export const PanelManager = (props: PanelManagerProps) => {
  const { type, value, codePrefix, codePostfix, schema, onChange, ...other } =
    props;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background pb-[var(--tab-lable-height)] inline-block"
      {...other}
    >
      <ResizablePanel defaultSize={50} className="sm:flex">
        <LeftPanel />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <RightPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
