import { APIVERSIONS } from "@/assets/constants/constants";
import Code from "@/components/custom/sandbox/editors/Code";
import Enum from "@/components/custom/sandbox/editors/Enum";
import List from "@/components/custom/sandbox/editors/List";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useApi } from "@/hooks/useApi";
import { debounce, deepEqual } from "@/lib/utils";
import { specsActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { updateSpecs } = specsActions;

const Api = (props: any) => {
  const {
    schema,
    api,
    build,
    checkoutAPIVersion,
    request: globalRequest,
    updateRequest,
    updateCheckoutAPIVersion,
    addUnsavedChanges,
  } = props;
  const { checkoutApi }: any = useSelector((state: RootState) => state.specs);
  const properties =
    checkoutApi?.components?.schemas?.[schema]?.properties ?? null;
  const [request, setRequest] = useState(globalRequest);
  const dispatch = useDispatch();
  const {
    data: apiSpecsData,
    loading: loadingApiSpecData,
    error: apiSpecsError,
  } = useApi(
    `api/specs/checkout/CheckoutService-v${checkoutAPIVersion[api]}.json`,
    "GET"
  );

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
    const syncGlobalState = debounce((localState: any, build: any) => {
      const isEqual = deepEqual(build.request[api], localState);
      dispatch(updateRequest(localState));
      dispatch(
        addUnsavedChanges({
          [api]: !isEqual,
        })
      );
    }, 1000);
    syncGlobalState(request, build);
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
            setRequest(value);
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
        <p className="border-b-2 flex text-sm">
          <span className="border-r-2 px-2 py-[1px]">version</span>
        </p>
        <div className="px-1 py-3">
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
        </div>
        {!loadingApiSpecData && (
          <List
            list={properties}
            values={Object.keys(request)}
            onChange={(value: any) => {
              const requestParameters = Object.keys(request);
              const isNewProperty = requestParameters.length < value.length;
              if (isNewProperty) {
                const latestKey = value[value.length - 1];
                const latestValue = properties[latestKey];
                let newProperty = null;
                if (latestValue.type === "string") {
                  newProperty = { [latestKey]: "" };
                  setRequest({ ...request, ...newProperty });
                } else if (latestValue.type === "boolean") {
                  newProperty = { [latestKey]: true };
                  setRequest({ ...request, ...newProperty });
                } else if (latestValue.type === "array") {
                  newProperty = { [latestKey]: [] };
                  setRequest({ ...request, ...newProperty });
                }
              } else {
                const removedProperties: any = requestParameters.filter((i) => {
                  return value.indexOf(i) < 0;
                });
                if (removedProperties.length > 0) {
                  let updatedRequest = { ...request };
                  let removedProperty = removedProperties.pop();
                  delete updatedRequest[removedProperty];
                  setRequest(updatedRequest);
                }
              }
            }}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Api;
