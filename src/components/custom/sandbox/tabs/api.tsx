import { APIVERSIONS } from "@/assets/constants/constants";
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
import { formulaActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { parseStringWithLinks } from "@/components/custom/utils/utilsComponents";

const { updateCheckoutAPIVersion } = formulaActions;

const Api = (props: any) => {
  const { schema } = props;
  const {
    paymentMethodsRequest,
    paymentsRequest,
    paymentsDetailsRequest,
    checkoutAPIVersion,
  } = useSelector((state: RootState) => state.formula);

  const { checkoutApi }: any = useSelector((state: RootState) => state.specs);
  const properties =
    checkoutApi?.components?.schemas?.[schema]?.properties ?? null;

  const dispatch = useDispatch();

  const request =
    schema === "PaymentMethodsRequest"
      ? paymentMethodsRequest
      : schema === "PaymentRequest"
        ? paymentsRequest
        : paymentsDetailsRequest
          ? paymentsDetailsRequest
          : null;

  if (!properties && !request) {
    return <div>loading...</div>;
  }
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block !overflow-y-scroll"
    >
      <ResizablePanel defaultSize={60} className="sm:flex">
        <CodeEditor type="json" code={JSON.stringify(request)} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={40} className="!overflow-y-scroll">
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={Object.keys(request)}
        >
          <p className="border-b-2 flex text-sm">
            <span className="border-r-2 px-2 py-[1px]">version</span>
          </p>
          <AccordionItem value="select-version" className="border-b-0 px-3">
            <AccordionTrigger className="px-1 py-3">
              <p className="text-sm">{`Checkout API v${checkoutAPIVersion}`}</p>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-xs pb-2 px-1">
                Find the release notes for the version you are using here.
              </p>
              <Enum
                value={checkoutAPIVersion}
                set={APIVERSIONS}
                title="Checkout API Version"
                onChange={(value: any) => {
                  const { adyenWebVersion } = value;
                  if (adyenWebVersion) {
                    dispatch(updateCheckoutAPIVersion(adyenWebVersion));
                  }
                }}
              />
            </AccordionContent>
          </AccordionItem>
          <p className="border-t-2 border-b-2 flex text-sm sticky top-0 bg-white z-10">
            <span className="border-r-2 px-2 py-[1px]">parameters</span>
          </p>
          {properties &&
            Object.keys(properties).map((property: any) => (
              <AccordionItem
                key={property}
                value={property}
                className="hover:no-underline px-3"
              >
                <AccordionTrigger className="px-1 py-3">
                  <p className="text-sm">{property}</p>
                  <p className="font-mono text-xs flex-grow text-left pl-2">
                    {properties[property].type}
                  </p>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-xs pb-2 px-1">
                    {parseStringWithLinks(properties[property].description)}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Api;
