import { APIVERSIONS } from "@/assets/constants/constants";
import CodeEditor from "@/components/custom/sandbox/editors/CodeEdito";
import Enum from "@/components/custom/sandbox/editors/Enum";
import { parseStringWithLinks } from "@/components/custom/utils/Utils";
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
import { useApi } from "@/hooks/useApi";
import { formulaActions, specsActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const { updateCheckoutAPIVersion, addUnsavedChanges } = formulaActions;
const { updateSpecs } = specsActions;

const Api = (props: any) => {
  const { schema, api } = props;
  const {
    paymentMethodsRequest,
    paymentsRequest,
    paymentsDetailsRequest,
    checkoutAPIVersion,
    build,
  } = useSelector((state: RootState) => state.formula);

  const { checkoutApi }: any = useSelector((state: RootState) => state.specs);
  const properties =
    checkoutApi?.components?.schemas?.[schema]?.properties ?? null;

  const dispatch = useDispatch();

  const {
    data: apiSpecsData,
    loading: loadingApiSpecData,
    error: apiSpecsError,
  } = useApi(
    `api/specs/checkout/CheckoutService-v${checkoutAPIVersion[api]}.json`,
    "GET"
  );

  const request =
    schema === "PaymentMethodsRequest"
      ? paymentMethodsRequest
      : schema === "PaymentRequest"
        ? paymentsRequest
        : paymentsDetailsRequest
          ? paymentsDetailsRequest
          : null;

  useEffect(() => {
    if (apiSpecsData) {
      dispatch(
        updateSpecs({
          checkoutApi: apiSpecsData,
        })
      );
    }
  }, [apiSpecsData]);

  if (apiSpecsError) {
    return <div>Error</div>;
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block !overflow-y-scroll"
    >
      <ResizablePanel defaultSize={50} className="sm:flex">
        <CodeEditor type="json" code={JSON.stringify(request)} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} className="!overflow-y-scroll">
        {loadingApiSpecData && (
          <div className="flex justify-center space-x-2 items-center text-center h-[100%]">
            <div className="animate-spin text-xs">
              <AutorenewIcon className="w-3 h-3" />
            </div>
            <div className="text-xs">loading...</div>
          </div>
        )}
        {!loadingApiSpecData && (
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
                <p className="text-sm">{`Checkout API v${checkoutAPIVersion[api]}`}</p>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-xs pb-2 px-1">
                  {`Change the version of ${api} to test different scenarios.`}
                </p>
                <Enum
                  value={checkoutAPIVersion[api]}
                  set={APIVERSIONS}
                  title="Checkout API Version"
                  onChange={(value: any) => {
                    dispatch(
                      addUnsavedChanges({
                        [api]: build.checkoutAPIVersion[api] !== value,
                      })
                    );
                    dispatch(updateSpecs(api));
                    dispatch(updateCheckoutAPIVersion({ [api]: value }));
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
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Api;
