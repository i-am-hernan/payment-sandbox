"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useEffect, useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { cn } from "@/lib/utils";

interface SandboxContentProps {
  main: any;
  topRight: any;
  bottomRight: any;
  view: "developer" | "preview" | "demo";
}

const Sandbox = ({
  main: Main,
  topRight: TopRight,
  bottomRight: BottomRight,
  view,
}: SandboxContentProps) => {
  const refA = useRef<ImperativePanelHandle>(null);
  const refB = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    if (view === "demo") {
      refA.current?.resize(0);
      refB.current?.resize(100);
    } else if (view === "preview") {
      refA.current?.resize(50);
      refB.current?.resize(0);
    } else if (view === "developer") {
      refA.current?.resize(60);
      refB.current?.resize(0);
    }
  }, [view]);

  const handleMainExpand = () => {
    refA.current?.resize(100);
  };

  const handleTopRightExpand = () => {
    refA.current?.resize(0);
    refB.current?.resize(0);
  };

  const handleBottomRightExpand = () => {
    refB.current?.resize(50);
  };

  const handleBottomRightContract = () => {
    refB.current?.resize(0);
  };

  const handleContract = () => {
    refA.current?.resize(60);
    refB.current?.resize(0);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background sm:!h-screen inline-block pt-[var(--topbar-width)] pb-[var(--footerbar-width)] pl-[var(--sidebar-width)]"
    >
      <ResizablePanel
        defaultSize={view === "developer" ? 60 : view === "preview" ? 50 : 0}
        ref={refA}
        maxSize={view === "demo" ? 0 : 100}
        className={cn(
          "transition-all duration-300 ease-in-out",
          view === "demo" && "opacity-0"
        )}
      >
        <div className="items-center justify-center flex w-full h-full">
          {React.cloneElement(Main, {
            onExpand: handleMainExpand,
            onContract: handleContract,
          })}
        </div>
      </ResizablePanel>
      <ResizableHandle
        className={cn(
          view === "demo" && "opacity-0 pointer-events-none hidden"
        )}
      />
      <ResizablePanel
        defaultSize={view === "developer" ? 40 : view === "preview" ? 50 : 100}
        className="transition-all duration-300 ease-in-out"
      >
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel
            defaultSize={view === "developer" ? 50 : 100}
            className="transition-all duration-300 ease-in-out"
          >
            <div className="items-center justify-center flex w-full h-full">
              {React.cloneElement(TopRight, {
                onExpand: handleTopRightExpand,
                onContract: handleContract,
              })}
            </div>
          </ResizablePanel>
          <ResizableHandle
            className={cn(
              view !== "developer" && "opacity-0 pointer-events-none hidden"
            )}
          />
          <ResizablePanel
            defaultSize={view === "developer" ? 50 : 0}
            maxSize={view === "preview" || view === "demo" ? 0 : 100}
            ref={refB}
            className={`transition-all duration-300 ease-in-out ${
              view === "developer" ? "min-h-[40px]" : ""
            }`}
          >
            <div className="items-center justify-center flex w-full h-full">
              {React.cloneElement(BottomRight, {
                onExpand: handleBottomRightExpand,
                onContract: handleBottomRightContract,
              })}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Sandbox;
