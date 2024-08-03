import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "@/components/custom/sandbox/editors/codeEditor";
import ListEditor from "@/components/custom/sandbox/editors/listEditor";

interface ManageEditorsProps {
  type: "html" | "css" | "js" | "api" | "events";
  title?: string;
  content?: string;
  code: string;
  version: string;
  versions: string[];
  value?: any;
  specs?: any;
  onChange: (config: any) => void;
}

export const ManageEditors = (props: ManageEditorsProps) => {
  const { type, value, code, specs, onChange, ...other } = props;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background pb-[var(--tab-lable-height)] inline-block"
      {...other}
    >
      <ResizablePanel defaultSize={50} className="sm:flex">
        <CodeEditor type="html" code={code}/>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ListEditor value={value} specs={specs}/>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
