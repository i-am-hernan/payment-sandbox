import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
  title: string;
  icon: JSX.Element;
  content: JSX.Element;
  value: string;
  unsavedChanges: boolean;
}

interface TabsProps {
  tabsMap: Tab[];
}

const SandboxTabs: React.FC<TabsProps> = (props: TabsProps) => {
  const { tabsMap } = props;

  return (
    <Tabs
      defaultValue={tabsMap[0].value}
      className="w-full h-full flex flex-col"
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
              <p className="px-1">{tab.title}</p>
              {tab.unsavedChanges && (
                <span className="ml-1 w-2 h-2 bg-grey border border-primary rounded-full inline-block"></span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </span>
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
