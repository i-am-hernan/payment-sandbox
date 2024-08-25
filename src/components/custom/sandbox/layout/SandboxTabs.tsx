import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsProps {
  tabsMap: [
    {
      title: string;
      content: JSX.Element;
      value: string;
    },
  ];
}

const SandboxTabs = (props: TabsProps) => {
  const { tabsMap } = props;

  return (
    <Tabs
      defaultValue={tabsMap[0].value}
      className="w-full h-full flex flex-col"
    >
      <span className="border-b-2 flex">
        <TabsList className="justify-start">
          {tabsMap.map((tab, index) => {
            return (
              <TabsTrigger
                key={index}
                value={tab.value}
                className="px-3 py-[2px]"
              >
                <p>{tab.title}</p>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </span>
      {tabsMap.map((tab, index) => {
        return (
          <TabsContent
            key={index}
            value={tab.value}
            className="w-full flex-grow overflow-y-scroll"
          >
            {tab.content}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default SandboxTabs;
