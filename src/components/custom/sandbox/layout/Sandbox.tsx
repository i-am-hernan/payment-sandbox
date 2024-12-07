"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";

interface SandboxContentProps {
  main: any;
  topRight: any;
  bottomRight: any;
  view: "developer" | "product" | "user";
}

const Sandbox = ({
  main: Main,
  topRight: TopRight,
  bottomRight: BottomRight,
  view,
}: SandboxContentProps) => {
  const refA = useRef<ImperativePanelHandle>(null);
  const refB = useRef<ImperativePanelHandle>(null);

  const handleMainExpand = () => {
    refA.current?.resize(100);
  };

  const handleTopRightExpand = () => {
    refA.current?.resize(0);
    refB.current?.resize(0);
  };

  const handleBottomRightExpand = () => {
    refA.current?.resize(0);
    refB.current?.resize(100);
  };

  const handleContract = () => {
    refA.current?.resize(60);
    refB.current?.resize(50);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background !h-[180vh] sm:!h-screen inline-block pt-[var(--topbar-width)] pl-[var(--sidebar-width)]"
    >
      <ResizablePanel
        defaultSize={
          view === "developer" ? 60 : view === "product" ? 50 : "user" ? 0 : 0
        }
        ref={refA}
        maxSize={view === "user" ? 0 : 100}
      >
        <div className="items-center justify-center flex w-full h-full">
          {React.cloneElement(Main, {
            onExpand: handleMainExpand,
            onContract: handleContract,
          })}
        </div>
      </ResizablePanel>
      {view !== "user" && <ResizableHandle />}
      <ResizablePanel
        defaultSize={
          view === "developer" ? 40 : view === "product" ? 50 : "user" ? 100 : 0
        }
      >
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={view === "developer" ? 50 : 100}>
            {React.cloneElement(TopRight, {
              onExpand: handleTopRightExpand,
              onContract: handleContract,
            })}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={view === "developer" ? 50 : 0}
            maxSize={view === "product" || view === "user" ? 0 : 100}
            ref={refB}
          >
            {React.cloneElement(BottomRight, {
              onExpand: handleBottomRightExpand,
              onContract: handleContract,
            })}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Sandbox;
