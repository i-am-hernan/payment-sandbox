import { APIVERSIONS } from "@/assets/constants/constants";
import Code from "@/components/custom/sandbox/editors/Code";
import OpenApiList from "@/components/custom/sandbox/editors/openApi/OpenApiList";
import Search from "@/components/custom/sandbox/editors/Search";
import VersionCompact from "@/components/custom/sandbox/editors/VersionCompact";
import Loading from "@/components/custom/utils/Loading";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { formulaActions, specsActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import {
  debounce,
  deepEqual,
  prettify,
  replaceKeyValueJSON,
} from "@/utils/utils";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImperativePanelHandle } from "react-resizable-panels";

const { updateSpecs } = specsActions;
const { addUnsavedChanges, updateCheckoutAPIVersion } = formulaActions;
const initialState = {
  parsed: null,
  stringified: "",
};

const apiRequestReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_PARSED":
      return { ...state, parsed: action.payload };
    case "SET_STRINGIFIED":
      return { ...state, stringified: action.payload };
    case "SET_BOTH":
      return {
        parsed: action.payload.parsed,
        stringified: action.payload.stringified,
      };
    default:
      return state;
  }
};

const Api = (props: any) => {
  const {
    schema,
    api,
    request: globalRequest,
    updateRequest,
    description,
  } = props;

  const { reset, checkoutAPIVersion, build } = useSelector(
    (state: RootState) => state.formula
  );
  const { checkoutConfiguration }: any = useSelector(
    (state: RootState) => state.specs
  );
  const { theme, view } = useSelector((state: RootState) => state.user);
  const schemas = checkoutConfiguration?.components?.schemas ?? null;
  const properties = schemas?.[schema]?.properties ?? null;
  const required = schemas?.[schema]?.required ?? null;

  const [apiRequest, dispatchApiRequest] = useReducer(
    apiRequestReducer,
    initialState
  );

  const [filteredProperties, setFilteredProperties] = useState(properties);
  const dispatch = useDispatch();

  const panelRef = useRef<ImperativePanelHandle>(null);

  const syncGlobalState: any = debounce((localState: any, build: any) => {
    const isEqual = deepEqual(build.request[api], localState);
    if (!isEqual) {
      dispatch(updateRequest(localState));
      dispatch(
        addUnsavedChanges({
          [api]: true,
        })
      );
    } else {
      dispatch(
        addUnsavedChanges({
          [api]: false,
        })
      );
    }
  }, 1000);

  const syncLocalState = async (request: any) => {
    let prettifiedString = await prettify(JSON.stringify(request), "json");
    dispatchApiRequest({
      type: "SET_BOTH",
      payload: {
        parsed: request,
        stringified: prettifiedString,
      },
    });
  };

  const handlePrettify = useCallback(async () => {
    try {
      let prettifiedString = await prettify(apiRequest.stringified, "json");
      dispatchApiRequest({
        type: "SET_STRINGIFIED",
        payload: prettifiedString,
      });
    } catch (e) {
      console.error(e);
    }
  }, [apiRequest.stringified]);

  const handleOpenApiChange = useCallback(
    async (value: any) => {
      const requestParameters = Object.keys(apiRequest.parsed);
      const isNewProperty = requestParameters.length < value.length;
      if (isNewProperty) {
        const latestKey = value[value.length - 1];
        const latestValue = properties[latestKey];
        let newProperty = null;
        if (latestValue.type === "string") {
          newProperty = { [latestKey]: "" };
        } else if (latestValue.type === "boolean") {
          newProperty = { [latestKey]: true };
        } else if (latestValue.type === "integer") {
          newProperty = { [latestKey]: 0 };
        } else if (latestValue.type === "array") {
          newProperty = { [latestKey]: [] };
        } else if (!latestValue.type) {
          newProperty = { [latestKey]: {} };
        } else if (latestValue.type === "object") {
          newProperty = { [latestKey]: {} };
        }
        //setRequest({ ...request, ...newProperty });
        dispatchApiRequest({
          type: "SET_BOTH",
          payload: {
            parsed: { ...apiRequest.parsed, ...newProperty },
            stringified: await prettify(
              JSON.stringify({ ...apiRequest.parsed, ...newProperty }),
              "json"
            ),
          },
        });
      } else {
        const removedProperties: any = requestParameters.filter((i) => {
          return value.indexOf(i) < 0;
        });
        if (removedProperties.length > 0) {
          let updatedRequest = { ...apiRequest.parsed };
          let removedProperty = removedProperties.pop();
          delete updatedRequest[removedProperty];
          // setRequest(updatedRequest);
          dispatchApiRequest({
            type: "SET_BOTH",
            payload: {
              parsed: updatedRequest,
              stringified: await prettify(
                JSON.stringify(updatedRequest),
                "json"
              ),
            },
          });
        }
      }
    },
    [apiRequest.parsed, properties]
  );

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
          checkoutConfiguration: apiSpecsData,
        })
      );
    }
  }, [apiSpecsData]);

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    syncLocalState(globalRequest);
  }, [reset]);

  useEffect(() => {
    if (apiRequest.parsed !== null) {
      syncGlobalState(apiRequest.parsed, build);
    }
  }, [apiRequest.parsed]);

  if (apiSpecsError) {
    return <div>Error</div>;
  }

  if (view === "demo" || view === "preview") {
    panelRef.current?.resize(0);
  } else if (view === "developer") {
    panelRef.current?.resize(50);
  }
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="inline-block !overflow-y-scroll pl-6 pt-1 pb-6"
    >
      <ResizablePanel
        defaultSize={view === "developer" ? 50 : 0}
        maxSize={view === "product" ? 0 : 100}
        ref={panelRef}
        className={cn(
          `shadow-hover sm:flex flex-col transition-all duration-300 ease-in-out rounded-lg ${view === "developer" ? "mr-6" : ""}`,
          view === "demo" && "opacity-0"
        )}
      >
        <div className="flex flex-col h-full border-[1px] rounded-lg p-[1px] border-border">
          <Code
            type="json"
            code={apiRequest.stringified}
            readOnly={false}
            theme={theme}
            onChange={(jsValue: any, stringValue: string) => {
              if (stringValue === apiRequest.stringified) {
                return;
              } else {
                dispatchApiRequest({
                  type: "SET_BOTH",
                  payload: {
                    parsed: jsValue,
                    stringified: stringValue,
                  },
                });
              }
            }}
          />
          <div className={`flex justify-end bg-background border-t-[1px] border-border`}>
            <Button
              key={"prettify"}
              variant="ghost"
              size="icon"
              className={`border-border rounded-none border-l-[1px] h-[var(--custom-prettify-height)]`}
              onClick={handlePrettify}
            >
              <span className="font-semibold text-xxs text-warning">
                {"{ }"}
              </span>
            </Button>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle
        className={`${cn(
          view !== "developer" && "opacity-0 pointer-events-none hidden"
        )} border-none bg-transparent`}
      />
      <ResizablePanel className="bg-background !overflow-y-scroll h-full rounded-lg border-[1px] border-border shadow-hover">
        {!loadingApiSpecData && apiSpecsData && (
          <div>
            <Search
              properties={properties}
              onChange={(filteredProperties: any) => {
                setFilteredProperties(filteredProperties);
              }}
              description={description}
              label={
                api === "paymentMethods"
                  ? "Payment Methods"
                  : api === "payments"
                    ? "Payments"
                    : api === "paymentsDetails"
                      ? "Payment Details"
                      : api === "sessions"
                        ? "Sessions"
                        : api
              }
              method="POST"
              tab={true}
            >
              <VersionCompact
                label={"Checkout API"}
                value={checkoutAPIVersion[api]}
                options={APIVERSIONS}
                onChange={(value: any) => {
                  dispatch(updateCheckoutAPIVersion({ [api]: value }));
                  dispatch(
                    addUnsavedChanges({
                      [api]: build.checkoutAPIVersion[api] !== value,
                    })
                  );
                }}
              />
            </Search>
            <OpenApiList
              openApi={apiSpecsData}
              properties={filteredProperties}
              required={required}
              selectedProperties={Object.keys(apiRequest.parsed)}
              values={apiRequest.parsed}
              setValues={async (
                value: any,
                keyString?: any,
                keyValue?: any,
                type?: string
              ) => {
                if (keyString && keyValue && type) {
                  let replacedValue = replaceKeyValueJSON(
                    apiRequest.stringified,
                    keyString,
                    JSON.stringify(keyValue),
                    type
                  );
                  dispatchApiRequest({
                    type: "SET_BOTH",
                    payload: {
                      parsed: value,
                      stringified: replacedValue,
                    },
                  });
                } else {
                  dispatchApiRequest({
                    type: "SET_BOTH",
                    payload: {
                      parsed: { ...apiRequest.parsed, ...value },
                      stringified: await prettify(
                        JSON.stringify({ ...apiRequest.parsed, ...value }),
                        "json"
                      ),
                    },
                  });
                }
              }}
              onChange={handleOpenApiChange}
            /></div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Api;
