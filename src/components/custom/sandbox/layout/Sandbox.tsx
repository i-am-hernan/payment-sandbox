"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";

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
      <ResizablePanel defaultSize={60} ref={refA}>
        <div className="items-center justify-center flex w-full h-full">
          {React.cloneElement(Main, {
            onExpand: handleMainExpand,
            onContract: handleContract,
          })}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={50}>
            {React.cloneElement(TopRight, {
              onExpand: handleTopRightExpand,
              onContract: handleContract,
            })}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50} ref={refB}>
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
