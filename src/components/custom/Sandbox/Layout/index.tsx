"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background !h-[180vh] sm:!h-screen inline-block pt-[var(--topbar-width)] pl-[var(--sidebar-width)]"
    >
      <ResizablePanel defaultSize={60} minSize={50} maxSize={70} className="hidden sm:flex">
        <div className="items-center justify-center p-3 font-semibold flex w-full h-full">
          {Main}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">
                <TopRight />
              </span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">
                <BottomRight />
              </span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default SandboxLayout;
