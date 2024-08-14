import CodeEditor from "@/components/custom/sandbox/editors/codeEditor";
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
import { formulaActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { check } from "prettier";
import { useDispatch, useSelector } from "react-redux";

const API = () => {
  const { paymentMethodsRequest } = useSelector(
    (state: RootState) => state.formula
  );
  const { checkoutApi }: any = useSelector((state: RootState) => state.specs);
  const paymentMethodsRequestSpecs = checkoutApi
    ? checkoutApi.components.schemas.PaymentMethodsRequest
    : null;
  const dispatch = useDispatch();
  const parameterTitle = "Adyen Web Version";

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block"
    >
      <ResizablePanel defaultSize={60} className="sm:flex">
        <CodeEditor type="json" code={JSON.stringify(paymentMethodsRequest)} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={40}>
        <p className="border-b-2 flex text-sm">
          <span className="border-r-2 px-2 py-[1px]">parameters</span>
        </p>
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["select-version"]}
        >
          <AccordionItem value="select-version">
            <AccordionTrigger className="px-3">
              <p className="text-sm">{parameterTitle}</p>
            </AccordionTrigger>
            <AccordionContent>lorem ipsum</AccordionContent>
          </AccordionItem>
          {paymentMethodsRequestSpecs && Object.keys(paymentMethodsRequestSpecs.properties).map((property: any) => (
            <AccordionItem key={property} value={property}>
              <AccordionTrigger className="px-3">
                <p className="text-sm">{property}</p>
              </AccordionTrigger>
              <AccordionContent>
                <p>lorem ipsum</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default API;
