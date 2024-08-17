import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsProps {
  titles: string[];
  key: string;
  contents: React.ReactNode[];
  values: string[];
}

const SandboxTabs = ({ titles, contents, values }: TabsProps) => {
  return (
    <Tabs defaultValue={values[0]} className="w-full h-full flex flex-col">
      <span className="border-b-2 flex">
        <TabsList className="justify-start">
          {titles.map((title, index) => {
            return (
              <TabsTrigger
                key={index}
                value={values[index]}
                className="px-3 py-[2px]"
              >
                <p>{title}</p>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </span>
      {contents.map((content, index) => {
        return (
          <TabsContent
            key={index}
            value={values[index]}
            className="w-full flex-grow overflow-y-scroll"
          >
            {content}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default SandboxTabs;
