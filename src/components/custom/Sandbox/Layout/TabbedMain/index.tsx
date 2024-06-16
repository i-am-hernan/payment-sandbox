import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabbedMainProps {
  titles: string[];
  contents: React.ReactNode[];
}
//data-[state=active]:border-primary data-[state=active]:border-[1px]
const TabbedMain = ({
  titles: Titles,
  contents: Contents,
}: TabbedMainProps) => {
  return (
    <Tabs defaultValue={Titles[0]} className="w-full h-full flex flex-col">
      <span className="border-b-4 flex">
        <TabsList className="justify-start">
          {Titles.map((title, index) => {
            return (
              <TabsTrigger
                key={index}
                value={title}
                className="px-3 py-1"
              >
                <p >{title}</p>
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

export default TabbedMain;
