import { WEBVERSIONS } from "@/assets/constants/constants";
import Code from "@/components/custom/sandbox/editors/Code";
import Search from "@/components/custom/sandbox/editors/Search";
import Version from "@/components/custom/sandbox/editors/Version";
import Loading from "@/components/custom/utils/Loading";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImperativePanelHandle } from "react-resizable-panels";
import { OpenSdkList } from "../editors/openSdk/OpenSdkList";
import { SpecsList } from "@/store/reducers/specs";

const { updateSpecs } = specsActions;
const { addUnsavedChanges, updateAdyenWebVersion } = formulaActions;

interface SdkMapValue {
  storeConfiguration: any;
  updateStoreConfiguration: (value: any) => void;
  configurationType: string;
  description: string;
}

interface SdkMapType {
  [key: string]: SdkMapValue;
}

interface SdkTabsProps {
  sdkMap: SdkMapType;
  theme: string;
  view: "developer" | "preview" | "demo";
  integration: string;
  variant: string;
}

interface ConfigState {
  parsed: any;
  stringified: string;
  filteredProperties: Record<string, any>;
}

interface ConfigsState {
  checkoutConfiguration: ConfigState;
  txVariantConfiguration: ConfigState;
}

const formatJsString = (code: any, varName: string) => {
  return `var ${varName} = ${code};`;
};

const SdkTabs: React.FC<SdkTabsProps> = (props) => {
  const { sdkMap, theme, view, integration, variant } = props;
  const [activeTab, setActiveTab] = useState<keyof ConfigsState>(
    "checkoutConfiguration"
  );
  const [configs, setConfigs] = useState<ConfigsState>({
    checkoutConfiguration: {
      parsed: null,
      stringified: "",
      filteredProperties: {},
    },
    txVariantConfiguration: {
      parsed: null,
      stringified: "",
      filteredProperties: {},
    },
  });

  const panelRef = useRef<ImperativePanelHandle>(null);
  const dispatch = useDispatch();
  const { reset, build, adyenWebVersion } = useSelector(
    (state: RootState) => state.formula
  );
  const specs = useSelector((state: RootState) => state.specs);

  // Fetch SDK specs based on active tab
  const url = `api/specs/adyen-web/v${adyenWebVersion.replaceAll(".", "_")}/${
    activeTab === "checkoutConfiguration" ? "checkout" : "variant"
  }?${activeTab === "txVariantConfiguration" ? `txvariant=${variant}` : ""}`;

  const { data: sdkSpecsData, loading: loadingSdkSpecData } = useApi(
    url,
    "GET"
  );

  // Update specs when data changes
  useEffect(() => {
    if (sdkSpecsData) {
      dispatch(updateSpecs({ [activeTab]: sdkSpecsData }));
      // Update filtered properties for the active tab
      setConfigs((prev) => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          filteredProperties: sdkSpecsData,
        },
      }));
    }
  }, [sdkSpecsData, activeTab, dispatch]);

  // Update the useEffect that handles specs changes
  useEffect(() => {
    Object.keys(specs).forEach((key) => {
      if (specs[key as keyof SpecsList]) {
        const specData = specs[key as keyof SpecsList];
        // Extract schema properties from the spec data
        const schemaProps =
          specData?.components?.schemas?.[key]?.properties || specData;

        setConfigs((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            filteredProperties: schemaProps,
          },
        }));
      }
    });
  }, [specs]);

  // Initialize configs
  useEffect(() => {
    Object.entries(sdkMap).forEach(async ([key, value]: [string, any]) => {
      const prettifiedString = await prettify(
        formatJsString(value.storeConfiguration, value.configurationType),
        "babel"
      );
      setConfigs((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          parsed: unstringifyObject(value.storeConfiguration),
          stringified: prettifiedString,
        },
      }));
    });
  }, [reset]);

  // Handle panel resize based on view
  useEffect(() => {
    if (view === "demo" || view === "preview") {
      panelRef.current?.resize(0);
    } else if (view === "developer") {
      panelRef.current?.resize(50);
    }
  }, [view]);

  const syncGlobalState = useCallback(
    debounce((value: any, configType: string) => {
      const { updateStoreConfiguration } = sdkMap[configType];
      const stringifiedValue = stringifyObject(value);
      dispatch(updateStoreConfiguration(stringifiedValue));
      dispatch(addUnsavedChanges({ js: true }));
    }, 1000),
    []
  );

  const handleCodeChange = async (jsValue: any, stringValue: string) => {
    if (stringValue === configs[activeTab].stringified) return;

    setConfigs((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        parsed: jsValue,
        stringified: stringValue,
      },
    }));
    syncGlobalState(jsValue, activeTab);
  };

  const handlePrettify = async () => {
    const prettifiedString = await prettify(
      configs[activeTab].stringified,
      "babel"
    );
    setConfigs((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        stringified: prettifiedString,
      },
    }));
  };

  const handleSearchChange = (filteredProps: Record<string, any>) => {
    setConfigs((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        filteredProperties: filteredProps,
      },
    }));
  };

  const handleOpenSdkListChange = useCallback(
    async (value: string[], configType: keyof ConfigsState) => {
      const currentConfig = configs[configType];
      const configParameters = Object.keys(currentConfig.parsed || {});
      const isNewProperty = configParameters.length < value.length;

      if (isNewProperty) {
        const latestKey = value[value.length - 1];
        const latestValue = currentConfig.filteredProperties[latestKey];
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
        } else if (!latestValue.type || latestValue.type === "object") {
          newProperty = { [latestKey]: {} };
        } else if (latestValue.type === "function") {
          newProperty = { [latestKey]: function () {} };
        }

        const newParsed = {
          ...currentConfig.parsed,
          ...newProperty,
        };

        const newStringified = await prettify(
          formatJsString(
            stringifyObject(newParsed),
            sdkMap[configType].configurationType
          ),
          "babel"
        );

        setConfigs((prev) => ({
          ...prev,
          [configType]: {
            ...prev[configType],
            parsed: newParsed,
            stringified: newStringified,
          },
        }));
        syncGlobalState(newParsed, configType);
      } else {
        // Handle property removal
        const removedProperties = configParameters.filter(
          (i) => !value.includes(i)
        );
        if (removedProperties.length > 0) {
          const updatedParsed = { ...currentConfig.parsed };
          const removedProperty = removedProperties[0];
          delete updatedParsed[removedProperty];

          const newStringified = await prettify(
            formatJsString(
              stringifyObject(updatedParsed),
              sdkMap[configType].configurationType
            ),
            "babel"
          );

          setConfigs((prev) => ({
            ...prev,
            [configType]: {
              ...prev[configType],
              parsed: updatedParsed,
              stringified: newStringified,
            },
          }));
          syncGlobalState(updatedParsed, configType);
        }
      }
    },
    [configs, sdkMap, syncGlobalState]
  );

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block !overflow-y-scroll"
    >
      <ResizablePanel
        defaultSize={view === "developer" ? 50 : 0}
        maxSize={view === "preview" ? 0 : 100}
        ref={panelRef}
        className={cn(
          "sm:flex bg-code flex-col items-stretch",
          view === "demo" && "opacity-0"
        )}
      >
        <Code
          type="babel"
          code={configs[activeTab].stringified}
          readOnly={false}
          theme={theme}
          onChange={handleCodeChange}
          jsVariable={sdkMap[activeTab].configurationType}
        />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none border-l-[1px] h-5"
          onClick={handlePrettify}
        >
          <span className="font-semibold text-xxs text-warning">{"{}"}</span>
        </Button>
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
        {
          <Version
            label="adyen web"
            value={adyenWebVersion}
            options={
              integration === "sessions"
                ? WEBVERSIONS.filter((v) => /^[5-9]/.test(v))
                : WEBVERSIONS
            }
            onChange={(v: any) => dispatch(updateAdyenWebVersion(v))}
          />
        }
        {loadingSdkSpecData ? (
          <Loading className="text-foreground" />
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={(value: string) =>
              setActiveTab(value as keyof ConfigsState)
            }
          >
            <TabsList>
              {Object.entries(sdkMap).map(([key, value]: [string, any]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="px-2 py-[2px] data-[state=active]:border-info data-[state=inactive]:hover:border-info"
                >
                  <p className="p-[3px] text-xs text-foreground">
                    {value.configurationType}
                  </p>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(sdkMap).map(([key, value]: [string, any]) => (
              <TabsContent key={key} value={key} className="flex-grow">
                <Search
                  properties={specs[key as keyof SpecsList]}
                  onChange={handleSearchChange}
                  description={value.description}
                  label={value.configurationType}
                  method="object"
                  tab={false}
                />
                <OpenSdkList
                  openSdk={sdkSpecsData}
                  properties={
                    specs[key as keyof SpecsList]?.components?.schemas?.[key]
                      ?.properties || configs[key].filteredProperties
                  }
                  selectedProperties={Object.keys(configs[key].parsed || {})}
                  values={configs[key].parsed}
                  setValues={async (
                    newValue: any,
                    keyString?: string,
                    keyValue?: any,
                    type?: string
                  ) => {
                    try {
                      if (keyString && type) {
                        // Handle individual property updates
                        const newStringified = replaceKeyValue(
                          configs[key].stringified,
                          keyString,
                          typeof keyValue === "string" ||
                            typeof keyValue === "function"
                            ? keyValue
                            : JSON.stringify(keyValue),
                          type
                        );

                        const prettifiedString = await prettify(
                          newStringified,
                          "babel"
                        );

                        setConfigs((prev) => ({
                          ...prev,
                          [key]: {
                            ...prev[key],
                            parsed: newValue,
                            stringified: prettifiedString,
                          },
                        }));
                      } else {
                        // Handle bulk updates
                        const newStringified = formatJsString(
                          stringifyObject(newValue),
                          sdkMap[key].configurationType
                        );
                        const prettifiedString = await prettify(
                          newStringified,
                          "babel"
                        );

                        setConfigs((prev) => ({
                          ...prev,
                          [key]: {
                            ...prev[key],
                            parsed: newValue,
                            stringified: prettifiedString,
                          },
                        }));
                      }
                      syncGlobalState(newValue, key);
                    } catch (error) {
                      console.error("Error updating values:", error);
                    }
                  }}
                  onChange={(value: any) =>
                    handleOpenSdkListChange(value, key as keyof ConfigsState)
                  }
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default SdkTabs;
