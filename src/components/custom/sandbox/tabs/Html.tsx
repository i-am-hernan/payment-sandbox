import { WEBVERSIONS } from "@/assets/constants/constants";
import CodeEditor from "@/components/custom/sandbox/editors/CodeEdito";
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

const { updateAdyenWebVersion, addUnsavedChanges } = formulaActions;

const Html = () => {
  const { adyenWebVersion, build } = useSelector((state: RootState) => state.formula);
  const { variant } = useParams<{
    variant: string;
  }>();
  const dispatch = useDispatch();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block overflow-y-scroll"
    >
      <ResizablePanel defaultSize={50} className="sm:flex">
        <CodeEditor
          type="html"
          code={createHtmlCode(adyenWebVersion, variant)}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <p className="border-b-2 flex text-sm">
          <span className="border-r-2 px-2 py-[1px]">version</span>
        </p>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="select-version"
        >
          <AccordionItem value="select-version" className="px-3">
            <AccordionTrigger className="px-1 py-3">
              <p className="text-sm">{"Adyen Web"}</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xs pb-3 px-1">
                Find the release notes for the version you are using here.
              </p>
              <Enum
                value={adyenWebVersion}
                set={WEBVERSIONS}
                title="Adyen Web"
                onChange={(value: any) => {
                  dispatch(
                    addUnsavedChanges({ html: build.adyenWebVersion !== value })
                  );
                  dispatch(updateAdyenWebVersion(value));
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Html;
