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
  bottomRight?: any;
  view: "developer" | "preview" | "demo" | "subwindow";
  logs: boolean;
  className?: string;
}

const Sandbox = ({
  main: Main,
  topRight: TopRight,
  bottomRight: BottomRight,
  view,
  logs,
  className,
}: SandboxContentProps) => {
  const refA = useRef<ImperativePanelHandle>(null);
  const refB = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    if (view === "demo") {
      refA.current?.resize(100);
    } else if (view === "subwindow") {
      refA.current?.resize(30);
    } else if (view === "preview") {
      refA.current?.resize(50);
    } else if (view === "developer") {
      refA.current?.resize(60);
    }
  }, [view]);

  useEffect(() => {
    if (logs) {
      refB.current?.resize(50);
    } else {
      refB.current?.resize(0);
    }
  }, [logs]);

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
    if (view === "subwindow") {
      refA.current?.resize(30);
    } else if (view === "demo") {
      refA.current?.resize(100);
    } else if (view === "preview") {
      refA.current?.resize(50);
    } else if (view === "developer") {
      refA.current?.resize(60);
    } else {
      refA.current?.resize(60);
      refB.current?.resize(0);
    }
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
        {BottomRight && (
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel
              defaultSize={100}
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
              defaultSize={0}
              maxSize={50}
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
        )}
        {!BottomRight && (
          <div className="items-center justify-center flex w-full h-full animate-slide-in-right">
            {React.cloneElement(TopRight, {
              onExpand: handleTopRightExpand,
              onContract: handleContract,
            })}
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Sandbox;
//bg-dotted-grid bg-grid bg-background