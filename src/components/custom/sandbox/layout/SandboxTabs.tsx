import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { useState, useRef, useEffect } from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { Button } from "@/components/ui/button";
import { TabsProps } from "./types";
import MinimizeIcon from '@mui/icons-material/Minimize';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SandboxTabs: React.FC<TabsProps> = (props: TabsProps) => {
  const { tabsMap, crumbs, onExpand, onContract, type } = props;
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
    <Tabs
      defaultValue={tabTitle}
      className="w-full h-full flex flex-col"
      onValueChange={(value) => setTabTitle(value)}
    >
      <span className="border-b-2 flex justify-between">
        <TabsList>
          {tabsMap.map((tab, index) => (
            <TabsTrigger
              key={index}
              value={tab.value}
              className={`flex px-2 py-[2px] justify-space-between ${tabsMap.length < 2 ? "border-dotted" : ""}`}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
            >
              <span>{tab.icon}</span>
              <p className="px-1 text-xs text-foreground">{tab.title}</p>
              {tab.unsavedChanges && (
                <span className="ml-1 w-2 h-2 bg-background border border-primary rounded-full inline-block"></span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <div>
          {!hasExpanded && (
            <Button
              key="clear"
              variant="outline"
              size="sm"
              className="shadow-none px-2 mb-0 pt-0 pb-0 border-r-0 border-t-0 border-b-0 rounded-none border-l-[2px] border-border"
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
              className="shadow-none px-2 mb-0 pt-0 pb-0 border-r-0 border-t-0 border-b-0 rounded-none border-l-[2px] border-border"
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
        </div>
      </span>
      {crumbs && (
        <span className="border-b-2 pl-3 flex">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <span className="font-semibold px-0 text-xxs">{"home"}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {crumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem key={index}>
                    <span className="font-semibold px-0 text-xxs">{crumb}</span>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </React.Fragment>
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <p className="font-semibold px-0 text-xxs">{tabTitle}</p>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </span>
      )}
      {tabsMap.map((tab, index) => (
        <TabsContent
          key={index}
          value={tab.value}
          className="w-full flex-grow overflow-y-scroll"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default SandboxTabs;
