import { WEBVERSIONS } from "@/assets/constants/constants";
import CodeEditor from "@/components/custom/sandbox/editors/codeEditor";
import Enum from "@/components/custom/sandbox/editors/Enum";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { createHtmlCode } from "@/lib/utils";
import { formulaActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const { updateAdyenWebVersion } = formulaActions;

const HTML = () => {
  const { adyenWebVersion } = useSelector((state: RootState) => state.formula);
  const { variant } = useParams<{
    variant: string;
  }>();
  const dispatch = useDispatch();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block"
    >
      <ResizablePanel defaultSize={60} className="sm:flex">
        <CodeEditor
          type="html"
          code={createHtmlCode(adyenWebVersion, variant)}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={40}>
        <p className="border-b-2 flex text-sm">
          <span className="border-r-2 px-2 py-[1px]">parameters</span>
        </p>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="select-version"
        >
          <AccordionItem value="select-version">
            <AccordionTrigger>
              <p className="text-sm pl-3">Adyen Web Version</p>
            </AccordionTrigger>
            <AccordionContent>
              <Enum
                version={adyenWebVersion}
                versions={WEBVERSIONS}
                versionTitle={"Adyen Web Version"}
                onChange={(value: any) => {
                  const { adyenWebVersion } = value;
                  if (adyenWebVersion) {
                    dispatch(updateAdyenWebVersion(adyenWebVersion));
                  }
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default HTML;
