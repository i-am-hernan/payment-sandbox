import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import React, { useEffect, useRef, useState } from "react";
import { TabsProps } from "./types";

const SandboxTabs: React.FC<TabsProps> = (props: TabsProps) => {
  const { tabsMap, crumbs, onExpand, onContract, type, className } = props;
  const [tabTitle, setTabTitle] = useState(tabsMap[0].value);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hasExpanded, setHasExpanded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (tabsMap.length > 1) {
        if (event.shiftKey && event.key === "ArrowRight") {
          event.preventDefault();
          const currentIndex = tabsMap.findIndex(
            (tab) => tab.value === tabTitle
          );
          const nextIndex = (currentIndex + 1) % tabsMap.length;
          setTabTitle(tabsMap[nextIndex].value);
          tabRefs.current[nextIndex]?.focus();
        } else if (event.shiftKey && event.key === "ArrowLeft") {
          event.preventDefault();
          const currentIndex = tabsMap.findIndex(
            (tab) => tab.value === tabTitle
          );
          const prevIndex =
            (currentIndex - 1 + tabsMap.length) % tabsMap.length;
          setTabTitle(tabsMap[prevIndex].value);
          tabRefs.current[prevIndex]?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tabTitle, tabsMap]);

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      <Tabs
        defaultValue={tabTitle}
        className="w-full h-full flex flex-col"
        onValueChange={(value) => setTabTitle(value)}
      >
        <span className="flex justify-between mb-2 pl-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent min-h-[45px] h-auto">
          <TabsList className="mt-3">
            {tabsMap.map((tab, index) => (
              <div key={index} className="p-[3px]">
                <TabsTrigger
                  key={index}
                  value={tab.value}
                  className={`flex px-2 py-[2px] justify-space-between`}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                >
                  <span>{tab.icon}</span>
                  <p className="px-1 text-xs">{tab.title}</p>
                  {tab.unsavedChanges && (
                    <span className="ml-1 w-2 h-2 rounded-full inline-block bg-adyen"></span>
                  )}
                </TabsTrigger>
              </div>
            ))}
          </TabsList>
          {!hasExpanded && (
            <Button
              key="clear"
              variant="outline"
              size="sm"
              className="shadow-none border-none w-7 h-7 rounded-none"
              onClick={(e) => {
                if (onExpand) {
                  onExpand();
                  setHasExpanded(!hasExpanded);
                }
              }}
            >
              {type === "subwindow" ? (
                <ExpandLessIcon className="text-primary !text-xs" />
              ) : (
                <OpenInFullIcon className="text-primary !text-xs" />
              )}
            </Button>
          )}
          {hasExpanded && (
            <Button
              key="clear"
              variant="outline"
              size="sm"
              className="shadow-none px-2 mb-0 pt-0 pb-0 border-none"
              onClick={(e) => {
                if (onContract) {
                  onContract();
                  setHasExpanded(!hasExpanded);
                }
              }}
            >
              {type === "subwindow" ? (
                <ExpandMoreIcon className="text-primary !text-xs" />
              ) : (
                <CloseFullscreenIcon className="text-primary !text-xs" />
              )}
            </Button>
          )}
        </span>
        {tabsMap.map((tab, index) => (
          <TabsContent
            key={index}
            value={tab.value}
            className="w-full flex-grow overflow-y-scroll rounded-md"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SandboxTabs;
