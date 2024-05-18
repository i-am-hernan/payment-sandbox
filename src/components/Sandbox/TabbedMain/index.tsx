import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


interface TabbedMainProps {
    titles: string[];
    contents: React.ReactNode[];
}

const TabbedMain = ({ titles: Titles, contents: Contents }: TabbedMainProps) => {

    return (<Tabs defaultValue={Titles[0]} className="w-full h-full">
        <TabsList>
            {Titles.map((title, index) => {
                return <TabsTrigger value={title}>{title}</TabsTrigger>
            })}
        </TabsList>
        {Contents.map((content, index) => {
            return (<TabsContent value={Titles[index]}>
                <Card>
                    <CardContent>
                        {content}
                    </CardContent>
                </Card>
            </TabsContent>)
        })
        }
    </Tabs>)
}

export default TabbedMain;