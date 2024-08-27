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
import { useState } from "react";

interface Tab {
  title: string;
  icon: JSX.Element;
  content: JSX.Element;
  value: string;
  unsavedChanges?: boolean;
}

interface TabsProps {
  tabsMap: Tab[];
  crumbs?: string[];
}

const SandboxTabs: React.FC<TabsProps> = (props: TabsProps) => {
  const { tabsMap, crumbs } = props;
  const [tabTitle, setTabTitle] = useState(tabsMap[0].value);

  return (
    <Tabs
      defaultValue={tabTitle}
      className="w-full h-full flex flex-col"
      onValueChange={(value) => setTabTitle(value)}
    >
      <span className="border-b-2 flex">
        <TabsList className="justify-start">
          {tabsMap.map((tab, index) => (
            <TabsTrigger
              key={index}
              value={tab.value}
              className=" flex px-2 py-[2px] justify-space-between"
            >
              <span>{tab.icon}</span>
              <p className="px-1 text-xs">{tab.title}</p>
              {tab.unsavedChanges && (
                <span className="ml-1 w-2 h-2 bg-grey border border-primary rounded-full inline-block"></span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
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
                <React.Fragment>
                  <BreadcrumbItem key={index}>
                    <span className="font-semibold px-0 text-xxs">{crumb}</span>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </React.Fragment>
              ))}
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <span className="font-semibold px-0 text-xxs">
                    {tabTitle}
                  </span>
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
