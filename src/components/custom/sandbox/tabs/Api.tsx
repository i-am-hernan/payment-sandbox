import { APIVERSIONS } from "@/assets/constants/constants";
import Code from "@/components/custom/sandbox/editors/Code";
import OpenApiList from "@/components/custom/sandbox/editors/OpenApiList";
import Version from "@/components/custom/sandbox/editors/Version";
import Loading from "@/components/custom/utils/Loading";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useApi } from "@/hooks/useApi";
import { debounce, deepEqual } from "@/lib/utils";
import { specsActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { updateSpecs } = specsActions;

const Api = (props: any) => {
  const {
    schema,
    reset,
    api,
    build,
    checkoutAPIVersion,
    request: globalRequest,
    updateRequest,
    clearOnDeckInfo,
    updateCheckoutAPIVersion,
    addUnsavedChanges,
    updateReset,
  } = props;
  const { checkoutApi }: any = useSelector((state: RootState) => state.specs);
  const schemas = checkoutApi?.components?.schemas ?? null;
  const properties = schemas?.[schema]?.properties ?? null;
  const required = schemas?.[schema]?.required ?? null;
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
    const syncGlobalState: any = debounce((localState: any, build: any) => {
      const isEqual = deepEqual(build.request[api], localState);
      dispatch(updateRequest(localState));
      dispatch(
        addUnsavedChanges({
          [api]: !isEqual,
        })
      );
    }, 1000);

    const syncLocalState = () => {
      setRequest(globalRequest);
      dispatch(updateReset(false));
    };

    if (reset) {
      syncLocalState();
    } else {
      syncGlobalState(request, build);
    }
  }, [request, reset]);

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
        {loadingApiSpecData && <Loading />}
        <Version
          label={api}
          value={checkoutAPIVersion[api]}
          options={APIVERSIONS}
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
        <p className="border-b-2 flex text-sm sticky top-0 bg-white z-10">
          <span className="border-r-2 px-2 py-[1px]">parameters</span>
        </p>
        {!loadingApiSpecData && (
          <OpenApiList
            openApi={checkoutApi}
            properties={properties}
            required={required}
            selectedProperties={Object.keys(request)}
            values={request}
            setValues={(value: any) => {
              setRequest(value);
            }}
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
                } else if (latestValue.type === "integer") {
                  newProperty = { [latestKey]: 0 };
                  setRequest({ ...request, ...newProperty });
                } else if (latestValue.type === "array") {
                  newProperty = { [latestKey]: [] };
                  setRequest({ ...request, ...newProperty });
                } else if (!latestValue.type) {
                  newProperty = { [latestKey]: {} };
                  setRequest({ ...request, ...newProperty });
                } else if (latestValue.type === "object") {
                  newProperty = { [latestKey]: {} };
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
