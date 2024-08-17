import {
  Tabs as ShadTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface TabsProps {
  titles: string[];
  contents: React.ReactNode[];
}

const Tabs = ({ titles: Titles, contents: Contents }: TabsProps) => {
  
  console.log("Tabs -> Contents", Contents);
  return (
    <ShadTabs defaultValue={Titles[0]} className="w-full h-full flex flex-col">
      <span className="border-b-2 flex">
        <TabsList className="justify-start">
          {Titles.map((title, index) => {
            return (
              <TabsTrigger key={index} value={title} className="px-3 py-[2px]">
                <p>{title}</p>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </span>
      {Contents.map((content, index) => {
        return (
          <TabsContent
            key={index}
            value={Titles[index]}
            className="w-full flex-grow overflow-y-scroll"
          >
            {content}
          </TabsContent>
        );
      })}
    </ShadTabs>
  );
};

export default Tabs;
