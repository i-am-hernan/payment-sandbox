import { WEBVERSIONS } from "@/assets/constants/constants";
import Code from "@/components/custom/sandbox/editors/Code";
import OpenApiSearch from "@/components/custom/sandbox/editors/openApi/OpenApiSearch";
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
  prettify,
  replaceKeyValue,
  sanitizeString,
  stringifyObject,
  unstringifyObject,
} from "@/utils/utils";
import { memo, useCallback, useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OpenSdkList } from "../editors/openSdk/OpenSdkList";

const { updateSpecs } = specsActions;
const {
  addUnsavedChanges,
  updateAdyenWebVersion,
  updateCheckoutConfiguration,
} = formulaActions;

const formatJsString = (code: any, varName: string) => {
  return `var ${varName} = ${code};`;
};

const initialState = {
  parsed: null,
  stringified: "",
};

const checkoutConfigReducer = (state: any, action: any) => {
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

const Script = () => {
  const {
    reset,
    build,
    checkoutConfiguration: globalCheckoutConfiguration,
    adyenWebVersion,
  } = useSelector((state: RootState) => state.formula);
  const { adyenWeb }: any = useSelector((state: RootState) => state.specs);
  const { response }: any = useSelector((state: RootState) => state.component);
  const { theme } = useSelector((state: RootState) => state.user);
  const { paymentMethods } = response;
  const properties = adyenWeb?.checkout ?? null;

  const [checkoutConfig, dispatchCheckoutConfig] = useReducer(
    checkoutConfigReducer,
    initialState
  );

  const dispatch = useDispatch();
  const {
    data: sdkSpecsData,
    loading: loadingSdkSpecData,
    error: sdkSpecsError,
  } = useApi(
    `api/specs/adyen-web/v${adyenWebVersion.replaceAll(".", "_")}/checkout`,
    "GET"
  );
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const checkoutConfigurationVar = "checkoutConfiguration";
  const syncGlobalState: any = useCallback(
    debounce((localState: any, build: any) => {
      let stringifiedLocalState = stringifyObject(localState);

      if (
        sanitizeString(build.checkoutConfiguration) !==
        sanitizeString(stringifiedLocalState)
      ) {
        dispatch(updateCheckoutConfiguration(stringifiedLocalState));
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

  const syncLocalState = useCallback(
    async (globalCheckoutConfiguration: any, checkoutConfigurationVar: any) => {
      let prettifiedString = await prettify(
        formatJsString(globalCheckoutConfiguration, checkoutConfigurationVar),
        "babel"
      );
      dispatchCheckoutConfig({
        type: "SET_BOTH",
        payload: {
          parsed: unstringifyObject(globalCheckoutConfiguration),
          stringified: prettifiedString,
        },
      });
    },
    []
  );

  useEffect(() => {
    if (sdkSpecsData) {
      dispatch(
        updateSpecs({
          adyenWeb: sdkSpecsData,
        })
      );
    }
  }, [sdkSpecsData]);

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    if (checkoutConfig.parsed !== null) {
      syncGlobalState(checkoutConfig.parsed, build);
    }
  }, [checkoutConfig.stringified]);

  useEffect(() => {
    syncLocalState(globalCheckoutConfiguration, checkoutConfigurationVar);
  }, [reset]);

  useEffect(() => {
    syncLocalState(globalCheckoutConfiguration, checkoutConfigurationVar);
  }, [paymentMethods, syncLocalState]);

  const handlePrettify = useCallback(async () => {
    try {
      let prettifiedString = await prettify(
        checkoutConfig.stringified,
        "babel"
      );
      dispatchCheckoutConfig({
        type: "SET_STRINGIFIED",
        payload: prettifiedString,
      });
    } catch (e) {
      console.error(e);
    }
  }, [checkoutConfig.stringified]);

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
      const checkoutParameters = Object.keys(checkoutConfig.parsed);
      const isNewProperty = checkoutParameters.length < value.length;
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
          ...checkoutConfig.parsed,
          ...newProperty,
        };
        dispatchCheckoutConfig({
          type: "SET_BOTH",
          payload: {
            parsed: newObject,
            stringified: await prettify(
              formatJsString(
                stringifyObject(newObject),
                checkoutConfigurationVar
              ),
              "babel"
            ),
          },
        });
      } else {
        const removedProperties: any = checkoutParameters.filter((i) => {
          return value.indexOf(i) < 0;
        });
        if (removedProperties.length > 0) {
          let updatedRequest = { ...checkoutConfig.parsed };
          let removedProperty = removedProperties.pop();
          delete updatedRequest[removedProperty];
          dispatchCheckoutConfig({
            type: "SET_BOTH",
            payload: {
              parsed: updatedRequest,
              stringified: await prettify(
                formatJsString(
                  stringifyObject(updatedRequest),
                  checkoutConfigurationVar
                ),
                "babel"
              ),
            },
          });
        }
      }
    },
    [checkoutConfig.parsed, properties, checkoutConfigurationVar]
  );

  if (sdkSpecsError) {
    return <div>Error</div>;
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block !overflow-y-scroll"
    >
      <ResizablePanel
        defaultSize={50}
        className="sm:flex bg-code flex-col items-stretch"
      >
        <div className="flex flex-1 overflow-scroll">
          <Code
            type="babel"
            code={checkoutConfig.stringified}
            readOnly={false}
            theme={theme}
            onChange={(jsValue: any, stringValue: string) => {
              if (stringValue === checkoutConfig.stringified) {
                return;
              } else {
                dispatchCheckoutConfig({
                  type: "SET_BOTH",
                  payload: {
                    parsed: jsValue,
                    stringified: stringValue,
                  },
                });
              }
            }}
            jsVariable={checkoutConfigurationVar}
          />
        </div>
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
      <ResizableHandle />
      <ResizablePanel defaultSize={50} className="!overflow-y-scroll">
        {loadingSdkSpecData && <Loading />}
        <Version
          label={"Adyen Web"}
          value={adyenWebVersion}
          options={WEBVERSIONS}
          onChange={handleVersionChange}
        />
        <OpenApiSearch
          properties={properties}
          onChange={handleOpenApiSearchChange}
        />
        {!loadingSdkSpecData && sdkSpecsData && checkoutConfig.parsed && (
          <MemoizedOpenSdkList
            openSdk={sdkSpecsData}
            properties={filteredProperties}
            selectedProperties={Object.keys(checkoutConfig.parsed)}
            values={checkoutConfig.parsed}
            setValues={(
              value: any,
              keyString: any,
              keyValue: any,
              type: string
            ) => {
              dispatchCheckoutConfig({
                type: "SET_BOTH",
                payload: {
                  parsed: value,
                  stringified: replaceKeyValue(
                    checkoutConfig.stringified,
                    keyString,
                    JSON.stringify(keyValue),
                    type
                  ),
                },
              });
            }}
            onChange={handleOpenSdkListChange}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

const MemoizedOpenSdkList = memo(OpenSdkList);

export default Script;
