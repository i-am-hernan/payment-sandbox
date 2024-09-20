import { APIVERSIONS } from "@/assets/constants/constants";
import Code from "@/components/custom/sandbox/editors/Code";
import Enum from "@/components/custom/sandbox/editors/Enum";
import { parseStringWithLinks } from "@/components/custom/utils/Utils";
import { deepEqual } from "@/lib/utils";
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
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { String } from "@/components/custom/sandbox/editors/String";

const {
  updatePaymentMethodsRequest,
  updatePaymentsRequest,
  updatePaymentsDetailsRequest,
  updateCheckoutAPIVersion,
  addUnsavedChanges,
} = formulaActions;
const { updateSpecs } = specsActions;

const Api = (props: any) => {
  const { schema, api } = props;
  const {
    request: formulaRequest,
    checkoutAPIVersion,
    build,
  } = useSelector((state: RootState) => state.formula);
  const { paymentMethods, payments, paymentsDetails } = formulaRequest;
  const [accordianProperties, setAccordianProperties] = useState([]);
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
      ? paymentMethods
      : schema === "PaymentRequest"
        ? payments
        : schema === "PaymentDetailsRequest"
          ? paymentsDetails
          : null;

  const updateRequest: any =
    schema === "PaymentMethodsRequest"
      ? updatePaymentMethodsRequest
      : schema === "PaymentRequest"
        ? updatePaymentsRequest
        : schema === "PaymentDetailsRequest"
          ? updatePaymentsDetailsRequest
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

  useEffect(() => {
    let updatedValues: any = [];
    if (request) {
      updatedValues = ["select-version", ...Object.keys(request)];
      setAccordianProperties(updatedValues);
    }
  }, [request]);

  if (apiSpecsError) {
    return <div>Error</div>;
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block !overflow-y-scroll"
    >
      <ResizablePanel defaultSize={50} className="sm:flex">
        <Code
          type="json"
          code={JSON.stringify(request)}
          readOnly={false}
          onChange={(value: any) => {
            const isEqual = deepEqual(build.request[api], value);
            dispatch(updateRequest(value));
            dispatch(
              addUnsavedChanges({
                [api]: !isEqual,
              })
            );
          }}
        />
      </ResizablePanel>
      <ResizableHandle />
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
            value={accordianProperties}
            onValueChange={(value: any) => {
              const isNewProperty =
                Object.keys(request).length < value.length - 1;

              if (isNewProperty) {
                const latestKey = value[value.length - 1];
                const latestValue = properties[latestKey];
                let newProperty = null;
                if (latestValue.type === "string") {
                  newProperty = { [latestKey]: "" };
                  dispatch(updateRequest(newProperty));
                } else if (latestValue.type === "boolean") {
                  newProperty = { [latestKey]: true };
                  dispatch(updateRequest(newProperty));
                } else if (latestValue.type === "array") {
                  newProperty = { [latestKey]: [] };
                  dispatch(updateRequest(newProperty));
                }
              }else{
                const removedKey = value.filter((x: any) => !request[x]);
                if(removedKey.length > 0){
                  console.log(removedKey)
                }
              }
            }}
          >
            <p className="border-b-2 flex text-sm">
              <span className="border-r-2 px-2 py-[1px]">version</span>
            </p>
            <AccordionItem
              disabled={true}
              value="select-version"
              className="border-b-0 px-3"
            >
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
                    {/* {properties[property].type === "string" && <String />} */}
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
