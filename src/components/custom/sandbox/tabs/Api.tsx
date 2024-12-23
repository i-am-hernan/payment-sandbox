import { APIVERSIONS } from "@/assets/constants/constants";
import Code from "@/components/custom/sandbox/editors/Code";
import OpenApiList from "@/components/custom/sandbox/editors/openApi/OpenApiList";
import Search from "@/components/custom/sandbox/editors/Search";
import Version from "@/components/custom/sandbox/editors/Version";
import Loading from "@/components/custom/utils/Loading";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useApi } from "@/hooks/useApi";
import { formulaActions, specsActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import {
  debounce,
  deepEqual,
  prettify,
  replaceKeyValueJSON,
  stringifyObject,
} from "@/utils/utils";
import { useCallback, useEffect, useReducer, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImperativePanelHandle } from "react-resizable-panels";
import { cn } from "@/lib/utils";

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
  const { schema, api, request: globalRequest, updateRequest, description } = props;

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
    if (view === "demo" || view === "preview") {
      panelRef.current?.resize(0);
    } else if (view === "developer") {
      panelRef.current?.resize(50);
    }
  }, [view]);

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

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block !overflow-y-scroll"
    >
      <ResizablePanel
        defaultSize={view === "developer" ? 50 : 0}
        maxSize={view === "product" ? 0 : 100}
        ref={panelRef}
        className={cn(
          "sm:flex bg-code flex-col transition-all duration-300 ease-in-out",
          view === "demo" && "opacity-0"
        )}
      >
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
        <div className={`flex justify-end border-y-2 bg-background`}>
          <Button
            key={"prettify"}
            variant="ghost"
            size="icon"
            className={`rounded-none border-l-[1px] h-5`}
            onClick={handlePrettify}
          >
            <span className="font-semibold text-xxs text-warning">{"{}"}</span>
          </Button>
        </div>
      </ResizablePanel>
      <ResizableHandle
        className={cn(
          view !== "developer" && "opacity-0 pointer-events-none hidden"
        )}
      />
      <ResizablePanel className="!overflow-y-scroll border-b-2">
        {loadingApiSpecData && <Loading className="text-foreground" />}
        {!loadingApiSpecData && apiSpecsData && (
          <Version
            label={"checkout api"}
            value={checkoutAPIVersion[api]}
            options={APIVERSIONS}
            onChange={(value: any) => {
              dispatch(
                addUnsavedChanges({
                  [api]: build.checkoutAPIVersion[api] !== value,
                })
              );
              dispatch(updateCheckoutAPIVersion({ [api]: value }));
            }}
          />
        )}
        {!loadingApiSpecData && apiSpecsData && (
          <Search
            properties={properties}
            onChange={(filteredProperties: any) => {
              setFilteredProperties(filteredProperties);
            }}
            description={description}
            label={api}
            method="POST"
          />
        )}
        {!loadingApiSpecData && apiSpecsData && (
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
                  stringifyObject(keyValue),
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
                      stringifyObject({ ...apiRequest.parsed, ...value }),
                      "json"
                    ),
                  },
                });
              }
            }}
            onChange={handleOpenApiChange}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Api;
