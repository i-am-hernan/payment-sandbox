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
  className?: string;
}

const Sandbox = ({
  main: Main,
  topRight: TopRight,
  bottomRight: BottomRight,
  view,
  className,
}: SandboxContentProps) => {
  const refA = useRef<ImperativePanelHandle>(null);
  const refB = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    if (view === "demo") {
      refA.current?.resize(0);
      refB.current?.resize(100);
    } else if (view === "preview") {
      refA.current?.resize(30);
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
      className={cn(
        "sm:!h-screen inline-block pt-[var(--topbar-width)] pl-[var(--sidebar-width)] border-b-[1px] border-border",
        className
      )}
    >
      <ResizablePanel
        defaultSize={view === "developer" ? 60 : view === "preview" ? 30 : 0}
        ref={refA}
        maxSize={view === "demo" ? 0 : 100}
        className={cn(
          "transition-all duration-300 ease-in-out",
          view === "demo" && "opacity-0",
          className
        )}
      >
        <div className="items-center justify-center flex w-full h-full animate-slide-in">
          {React.cloneElement(Main, {
            onExpand: handleMainExpand,
            onContract: handleContract,
          })}
        </div>
      </ResizablePanel>
      <ResizableHandle
        className={cn(
          view === "demo" && "opacity-0 pointer-events-none hidden",
          "border-none bg-transparent"
        )}
      />
      <ResizablePanel
        defaultSize={view === "developer" ? 40 : view === "preview" ? 70 : 100}
        className="transition-all duration-300 ease-in-out"
      >
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel
            defaultSize={view === "developer" ? 50 : 100}
            className="transition-all duration-300 ease-in-out"
          >
            <div className="items-center justify-center flex w-full h-full animate-slide-in-right">
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
            className={cn("transition-all duration-300 ease-in-out", className)}
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
//bg-dotted-grid bg-grid bg-background