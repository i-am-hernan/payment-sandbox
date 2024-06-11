"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useParams } from "next/navigation";

interface SandboxLayoutContentProps {
  main: any;
  topRight: any;
  bottomRight: any;
}

const SandboxLayout = ({
  main: Main,
  topRight: TopRight,
  bottomRight: BottomRight,
}: SandboxLayoutContentProps) => {
  const { variant } = useParams<{ variant: string }>();
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background !h-[180vh] sm:!h-screen inline-block pt-[var(--topbar-width)] pl-[var(--sidebar-width)]"
    >
      <ResizablePanel
        defaultSize={60}
        minSize={50}
        maxSize={70}
        className="sm:flex"
      >
        <div className="items-center justify-center p-3 flex w-full h-full">
          {Main}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
            <p className="bg-border leading-7 pl-2">{`${
              variant ? variant : "loading"
            }`}</p>
            <div className="h-full items-center justify-center p-6 overflow-auto">
              <span>{TopRight}</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <p className="bg-border leading-7 pl-2">state</p>
            <div className="flex h-full">
              <span className="flex h-full">{BottomRight}</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default SandboxLayout;
