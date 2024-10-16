import { APIVERSIONS } from "@/assets/constants/constants";
import Code from "@/components/custom/sandbox/editors/Code";
import OpenApiList from "@/components/custom/sandbox/editors/OpenApiList";
import OpenApiSearch from "@/components/custom/sandbox/editors/OpenApiSearch";
import Version from "@/components/custom/sandbox/editors/Version";
import Loading from "@/components/custom/utils/Loading";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useApi } from "@/hooks/useApi";
import { debounce, deepEqual } from "@/lib/utils";
import { formulaActions, specsActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { updateSpecs } = specsActions;
const { updateReset, addUnsavedChanges, updateCheckoutAPIVersion } =
  formulaActions;

const Api = (props: any) => {
  const { schema, api, request: globalRequest, updateRequest } = props;

  const { reset, checkoutAPIVersion, build } = useSelector(
    (state: RootState) => state.formula
  );
  const { checkoutApi }: any = useSelector((state: RootState) => state.specs);
  const { theme } = useSelector((state: RootState) => state.user);
  const schemas = checkoutApi?.components?.schemas ?? null;
  const properties = schemas?.[schema]?.properties ?? null;
  const required = schemas?.[schema]?.required ?? null;
  const [request, setRequest] = useState(globalRequest);
  const [filteredProperties, setFilteredProperties] = useState(properties);
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
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    const syncGlobalState: any = debounce((localState: any, build: any) => {
      const isEqual = deepEqual(build.request[api], localState);
      dispatch(updateRequest(localState));
      dispatch(
        addUnsavedChanges({
          [api]: !isEqual,
        })
      );
    }, 250);

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
          theme={theme}
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
            dispatch(updateSpecs(api)); //
            dispatch(updateCheckoutAPIVersion({ [api]: value }));
          }}
        />
        {
          <OpenApiSearch
            properties={properties}
            onChange={(filteredProperties: any) => {
              setFilteredProperties(filteredProperties);
            }}
          />
        }
        {!loadingApiSpecData && apiSpecsData && (
          <OpenApiList
            openApi={apiSpecsData}
            properties={filteredProperties}
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
