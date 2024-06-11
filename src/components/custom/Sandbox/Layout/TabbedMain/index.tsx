import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabbedMainProps {
  titles: string[];
  contents: React.ReactNode[];
}

const TabbedMain = ({
  titles: Titles,
  contents: Contents,
}: TabbedMainProps) => {
  return (
    <Tabs defaultValue={Titles[0]} className="w-full h-full flex flex-col">
      <span>
        <TabsList className="justify-start">
          {Titles.map((title, index) => {
            return (
              <TabsTrigger key={index} value={title} className="px-8">
                <p className="leading-7 pl-2">{title}</p>
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
            <Card className="w-full h-full rounded-lg border-2">
              <CardContent>{content}</CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default TabbedMain;
