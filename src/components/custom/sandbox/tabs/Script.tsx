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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OpenSdkList } from "../editors/openSdk/OpenSdkList";

const { updateSpecs } = specsActions;
const {
  updateReset,
  addUnsavedChanges,
  updateAdyenWebVersion,
  updateCheckoutConfiguration,
} = formulaActions;

const formatJsString = (code: any, varName: string) => {
  return `var ${varName} = ${code};`;
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
  const [checkoutConfiguration, setCheckoutConfiguration] = useState<any>(null);
  const [
    stringifiedCheckoutConfiguration,
    setStringifiedCheckoutConfiguration,
  ] = useState("");
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

  const syncGlobalState: any = debounce((localState: any, build: any) => {
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
    }
  }, 1000);

  const syncLocalState = async (
    globalCheckoutConfiguration: any,
    checkoutConfigurationVar: any
  ) => {
    let prettifiedString = await prettify(
      formatJsString(globalCheckoutConfiguration, checkoutConfigurationVar),
      "babel"
    );
    setCheckoutConfiguration(unstringifyObject(globalCheckoutConfiguration));
    setStringifiedCheckoutConfiguration(prettifiedString);
    dispatch(updateReset(false));
  };

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
    if (checkoutConfiguration !== null) {
      syncGlobalState(checkoutConfiguration, build);
    }
  }, [checkoutConfiguration]);

  useEffect(() => {
    if (reset) {
      syncLocalState(globalCheckoutConfiguration, checkoutConfigurationVar);
    }
  }, [reset]);

  useEffect(() => {
    syncLocalState(globalCheckoutConfiguration, checkoutConfigurationVar);
  }, [paymentMethods]);

  if (sdkSpecsError) {
    return <div>Error</div>;
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block !overflow-y-scroll"
    >
      <ResizablePanel defaultSize={50} className="sm:flex bg-code flex-col">
        <Code
          type="babel"
          code={stringifiedCheckoutConfiguration}
          readOnly={false}
          theme={theme}
          onChange={(jsValue: any, stringValue: string) => {
            setCheckoutConfiguration(jsValue);
            setStringifiedCheckoutConfiguration(stringValue);
          }}
          jsVariable={checkoutConfigurationVar}
        />
        <div className={`flex justify-end border-y-[1px] bg-background`}>
          <Button
            key={"prettify"}
            variant="ghost"
            size="icon"
            className={`rounded-none border-l-[1px] h-5`}
            onClick={async () => {
              try {
                let prettifiedString = await prettify(
                  stringifiedCheckoutConfiguration,
                  "babel"
                );
                setStringifiedCheckoutConfiguration(prettifiedString);
              } catch (e) {
                console.error(e);
              }
            }}
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
          onChange={(value: any) => {
            dispatch(
              addUnsavedChanges({
                js: adyenWebVersion !== value,
              })
            );
            dispatch(updateAdyenWebVersion(value));
          }}
        />
        <OpenApiSearch
          properties={properties}
          onChange={(filteredProperties: any) => {
            setFilteredProperties(filteredProperties);
          }}
        />
        {!loadingSdkSpecData && sdkSpecsData && checkoutConfiguration && (
          <OpenSdkList
            openSdk={sdkSpecsData}
            properties={filteredProperties}
            selectedProperties={Object.keys(checkoutConfiguration)}
            values={checkoutConfiguration}
            setValues={async (
              value: any,
              keyString: any,
              keyValue: any,
              type: string
            ) => {
              setCheckoutConfiguration(value);
              setStringifiedCheckoutConfiguration(
                replaceKeyValue(
                  stringifiedCheckoutConfiguration,
                  keyString,
                  JSON.stringify(keyValue),
                  type
                )
              );
            }}
            onChange={async (value: any) => {
              const checkoutParameters = Object.keys(checkoutConfiguration);
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
                  ...checkoutConfiguration,
                  ...newProperty,
                };
                setCheckoutConfiguration(newObject);
                let prettifiedNewObject = await prettify(
                  formatJsString(
                    stringifyObject(newObject),
                    checkoutConfigurationVar
                  ),
                  "babel"
                );
                setStringifiedCheckoutConfiguration(prettifiedNewObject);
              } else {
                const removedProperties: any = checkoutParameters.filter(
                  (i) => {
                    return value.indexOf(i) < 0;
                  }
                );
                if (removedProperties.length > 0) {
                  let updatedRequest = { ...checkoutConfiguration };
                  let removedProperty = removedProperties.pop();
                  delete updatedRequest[removedProperty];
                  setCheckoutConfiguration(updatedRequest);
                  let prettifiedNewObject = await prettify(
                    formatJsString(
                      stringifyObject(updatedRequest),
                      checkoutConfigurationVar
                    ),
                    "babel"
                  );
                  setStringifiedCheckoutConfiguration(prettifiedNewObject);
                }
              }
            }}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Script;
