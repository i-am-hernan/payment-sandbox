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
  versionTitle: string;
  value?: any;
  specs?: any;
  onChange: (config: any) => void;
}

export const ManageEditors = (props: ManageEditorsProps) => {
  const {
    type,
    title,
    content,
    code,
    version,
    versions,
    versionTitle,
    value,
    specs,
    onChange,
    ...other
  } = props;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block"
      {...other}
    >
      <ResizablePanel defaultSize={60} className="sm:flex">
        <CodeEditor type="html" code={code} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={40}>
        <ListEditor
          version={version}
          versions={versions}
          versionTitle={versionTitle}
          onChange={onChange}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
