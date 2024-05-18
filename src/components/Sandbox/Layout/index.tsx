"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useViewport from "@/hooks/useViewport";

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

  const { width } = useViewport();

  const breakpoint = (widthPX: any) => {
    if (widthPX < 640) {
      return 'sm';
    } else if (widthPX < 768) {
      return 'md';
    } else if (widthPX < 1024) {
      return 'lg';
    } else if (widthPX < 1280) {
      return 'xl';
    } else if (widthPX < 1536) {
      return '2xl';
    } else {
      return '3xl';
    }
  }

  const defaultMainSize = (() => {
    switch (breakpoint(width)) {
      case 'sm':
        return 0;
      case 'md':
        return 50;
      case 'lg':
        return 60;
      case 'xl':
        return 60;
      case '2xl':
        return 60;
      case '3xl':
        return 60;
      default:
        return 60;
    }
  })();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border bg-primary !h-[180vh] sm:!h-screen"
    >
      {defaultMainSize > 0 && <ResizablePanel defaultSize={defaultMainSize} minSize={50} maxSize={70}>
        <div className={`flex items-center justify-center p-6`}>
          <span className="font-semibold">
            <Main />
          </span>
        </div>
      </ResizablePanel>}
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
