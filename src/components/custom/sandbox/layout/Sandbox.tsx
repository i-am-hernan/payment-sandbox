"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useParams } from "next/navigation";

interface SandboxContentProps {
  main: any;
  topRight: any;
  bottomRight: any;
}

const Sandbox = ({
  main: Main,
  topRight: TopRight,
  bottomRight: BottomRight,
}: SandboxContentProps) => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background !h-[180vh] sm:!h-screen inline-block pt-[var(--topbar-width)] pl-[var(--sidebar-width)]"
    >
      <ResizablePanel defaultSize={60} minSize={50} maxSize={90}>
        <div className="items-center justify-center flex w-full h-full">
          {Main}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50}>{TopRight}</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>{BottomRight}</ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Sandbox;
