import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


interface DevToolsProps {
  titles: string[];
  contents: React.ReactNode[];
}

const DevTools = ({ titles: Titles, contents: Contents }: DevToolsProps) => {

  return (
    <Tabs defaultValue={Titles[0]} className="w-full h-full flex flex-col">
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
            className="w-full flex-grow"
          >
            {content}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default DevTools;
