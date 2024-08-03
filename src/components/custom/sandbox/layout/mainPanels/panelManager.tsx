import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { LeftPanel } from "@/components/custom/sandbox/layout/mainPanels/leftPanel";
import { RightPanel } from "@/components/custom/sandbox/layout/mainPanels/rightPanel";
import codeEditor from "@/components/custom/sandbox/codeEditor";
import CodeEditor from "@/components/custom/sandbox/codeEditor";

interface PanelManagerProps {
  type: "html" | "css" | "js" | "api" | "events";
  title?: string;
  content?: string;
  value: any;
  code: string;
  specs?: any;
  onChange: (config: any) => void;
}

export const PanelManager = (props: PanelManagerProps) => {
  const {
    type,
    value,
    code,
    specs,
    onChange,
    ...other
  } = props;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background pb-[var(--tab-lable-height)] inline-block"
      {...other}
    >
      <ResizablePanel defaultSize={50} className="sm:flex">
        <CodeEditor code={code} type="html"/>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <RightPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
