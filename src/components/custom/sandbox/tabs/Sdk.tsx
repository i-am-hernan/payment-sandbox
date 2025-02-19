import { WEBVERSIONS } from "@/assets/constants/constants";
import Code from "@/components/custom/sandbox/editors/Code";
import Search from "@/components/custom/sandbox/editors/Search";
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
  prettify,
  replaceKeyValue,
  sanitizeString,
  stringifyObject,
  unstringifyObject,
} from "@/utils/utils";
import {
  memo,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImperativePanelHandle } from "react-resizable-panels";
import { OpenSdkList } from "../editors/openSdk/OpenSdkList";
import VersionCompact from "../editors/VersionCompact";

const { updateSpecs } = specsActions;
const { addUnsavedChanges, updateAdyenWebVersion } = formulaActions;

const formatJsString = (code: any, varName: string) => {
  return `var ${varName} = ${code};`;
};

const initialState = {
  parsed: null,
  stringified: "",
};

const configReducer = (state: any, action: any) => {
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

const Sdk = (props: any) => {
  const {
    storeConfiguration,
    updateStoreConfiguration,
    configurationType,
    variant,
    theme,
    view,
    integration,
    description,
  } = props;

  const { reset, build, adyenWebVersion } = useSelector(
    (state: RootState) => state.formula
  );

  const url = `api/specs/adyen-web/v${adyenWebVersion.replaceAll(".", "_")}/${configurationType === "checkoutConfiguration" ? "checkout" : "variant"}?${configurationType === "txVariantConfiguration" ? `txvariant=${variant}` : ""}`;
  const {
    data: sdkSpecsData,
    loading: loadingSdkSpecData,
    error: sdkSpecsError,
  } = useApi(url, "GET");

  const specs: any = useSelector((state: RootState) => state.specs);
  const { checkoutConfiguration, txVariantConfiguration } = specs;
  const properties =
    (checkoutConfiguration || txVariantConfiguration) &&
    configurationType === "checkoutConfiguration"
      ? checkoutConfiguration
      : txVariantConfiguration;

  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [config, dispatchConfig] = useReducer(configReducer, initialState);

  const panelRef = useRef<ImperativePanelHandle>(null);
  const dispatch = useDispatch();

  const syncGlobalState: any = useCallback(
    debounce((localState: any, build: any) => {
      let stringifiedLocalState = stringifyObject(localState);

      if (
        sanitizeString(build[configurationType]) !==
        sanitizeString(stringifiedLocalState)
      ) {
        dispatch(updateStoreConfiguration(stringifiedLocalState));
        dispatch(
          addUnsavedChanges({
            js: true,
          })
        );
      } else {
        dispatch(
          addUnsavedChanges({
            js: false,
          })
        );
      }
    }, 1000),
    [dispatch]
  );

  const syncLocalState = useCallback(async (configuration: any, type: any) => {
    let prettifiedString = await prettify(
      formatJsString(configuration, type),
      "babel"
    );
    dispatchConfig({
      type: "SET_BOTH",
      payload: {
        parsed: unstringifyObject(configuration),
        stringified: prettifiedString,
      },
    });
  }, []);

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    if (sdkSpecsData) {
      dispatch(
        updateSpecs({
          [configurationType]: sdkSpecsData,
        })
      );
    } else if (sdkSpecsError) {
      dispatch(
        updateSpecs({
          [configurationType]: {},
        })
      );
    }
  }, [sdkSpecsData, sdkSpecsError]);

  useEffect(() => {
    if (view === "demo" || view === "preview") {
      panelRef.current?.resize(0);
    } else if (view === "developer") {
      panelRef.current?.resize(50);
    }
  }, [view]);

  useEffect(() => {
    if (config.parsed !== null) {
      syncGlobalState(config.parsed, build);
    }
  }, [config.stringified]);

  useEffect(() => {
    syncLocalState(storeConfiguration, configurationType);
  }, [reset]);

  const handlePrettify = useCallback(async () => {
    try {
      let prettifiedString = await prettify(config.stringified, "babel");
      dispatchConfig({
        type: "SET_STRINGIFIED",
        payload: prettifiedString,
      });
    } catch (e) {
      console.error(e);
    }
  }, [config.stringified]);

  const handleVersionChange = useCallback(
    (value: any) => {
      dispatch(
        addUnsavedChanges({
          js: adyenWebVersion !== value,
        })
      );
      dispatch(updateAdyenWebVersion(value));
    },
    [adyenWebVersion, dispatch]
  );

  const handleOpenApiSearchChange = useCallback((filteredProperties: any) => {
    setFilteredProperties(filteredProperties);
  }, []);

  const handleOpenSdkListChange = useCallback(
    async (value: any) => {
      const configParameters = Object.keys(config.parsed);
      const isNewProperty = configParameters.length < value.length;
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
        } else if (latestValue.type === "enum") {
          newProperty = { [latestKey]: "" };
        } else if (!latestValue.type) {
          newProperty = { [latestKey]: {} };
        } else if (latestValue.type === "object") {
          newProperty = { [latestKey]: {} };
        } else if (latestValue.type === "function") {
          newProperty = { [latestKey]: function () {} };
        }
        let newObject = {
          ...config.parsed,
          ...newProperty,
        };
        dispatchConfig({
          type: "SET_BOTH",
          payload: {
            parsed: newObject,
            stringified: await prettify(
              formatJsString(stringifyObject(newObject), configurationType),
              "babel"
            ),
          },
        });
      } else {
        const removedProperties: any = configParameters.filter((i) => {
          return value.indexOf(i) < 0;
        });
        if (removedProperties.length > 0) {
          let updatedRequest = { ...config.parsed };
          let removedProperty = removedProperties.pop();
          delete updatedRequest[removedProperty];
          dispatchConfig({
            type: "SET_BOTH",
            payload: {
              parsed: updatedRequest,
              stringified: await prettify(
                formatJsString(
                  stringifyObject(updatedRequest),
                  configurationType
                ),
                "babel"
              ),
            },
          });
        }
      }
    },
    [config.parsed, properties, configurationType]
  );

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block !overflow-y-scroll"
    >
      <ResizablePanel
        defaultSize={view === "developer" ? 50 : 0}
        maxSize={view === "preview" ? 0 : 100}
        className={cn(
          "sm:flex bg-code flex-col items-stretch transition-all duration-300 ease-in-out",
          view === "demo" && "opacity-0"
        )}
        ref={panelRef}
      >
        <div className="flex flex-1 overflow-scroll">
          <Code
            type="babel"
            code={config.stringified}
            readOnly={false}
            theme={theme}
            onChange={(jsValue: any, stringValue: string) => {
              if (stringValue === config.stringified) {
                return;
              } else {
                dispatchConfig({
                  type: "SET_BOTH",
                  payload: {
                    parsed: jsValue,
                    stringified: stringValue,
                  },
                });
              }
            }}
            jsVariable={configurationType}
          />
        </div>
        <div className={`flex justify-end border-t-2 bg-background`}>
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
      <ResizablePanel
        defaultSize={view === "developer" ? 50 : 100}
        className="!overflow-y-scroll"
      >
        {loadingSdkSpecData && <Loading className="text-foreground" />}
        {properties && (
          <div>
            <Search
              properties={properties}
              onChange={handleOpenApiSearchChange}
              description={description}
              label={configurationType}
              method="object"
            >
              <VersionCompact
                label={"Adyen Web"}
                value={adyenWebVersion}
                options={
                  integration === "sessions"
                    ? WEBVERSIONS.filter((version: string) =>
                        /^[5-9]/.test(version)
                      )
                    : WEBVERSIONS
                }
                onChange={handleVersionChange}
              />
            </Search>
            <MemoizedOpenSdkList
              properties={filteredProperties}
              selectedProperties={Object.keys(config.parsed)}
              values={config.parsed}
              setValues={(
                value: any,
                keyString: any,
                keyValue: any,
                type: string
              ) => {
                dispatchConfig({
                  type: "SET_BOTH",
                  payload: {
                    parsed: value,
                    stringified: replaceKeyValue(
                      config.stringified,
                      keyString,
                      stringifyObject(keyValue),
                      type
                    ),
                  },
                });
              }}
              onChange={handleOpenSdkListChange}
            />
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

const MemoizedOpenSdkList = memo(OpenSdkList);

export default Sdk;
