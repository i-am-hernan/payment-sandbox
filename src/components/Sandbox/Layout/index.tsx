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
      className="rounded-lg border bg-primary !h-[180vh] sm:!h-screen"
    >
      <ResizablePanel defaultSize={60} minSize={50} maxSize={70} className="hidden sm:block">
        <div className="flex items-center justify-center p-6">
          <span className="font-semibold">
            <Main />
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
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
