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
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { formulaActions, specsActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import {
  cssToObject,
  debounce,
  prettify,
  sanitizeString,
  objectToCSS,
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
import { OpenCssList } from "../editors/openSdk/OpenCssList";

const { updateSpecs } = specsActions;
const { addUnsavedChanges, updateAdyenWebVersion, updateErrors } =
  formulaActions;

const formatCssString = (code: any) => {
  return code.slice(1, -1);
};

const initialState = {
  parsed: {},
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

const Style = (props: any) => {
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

  const { reset, build, adyenWebVersion, errors, style } = useSelector(
    (state: RootState) => state.formula
  );

  const { style: properties }: any = useSelector(
    (state: RootState) => state.specs
  );

  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [config, dispatchConfig] = useReducer(configReducer, initialState);

  const panelRef = useRef<ImperativePanelHandle>(null);
  const dispatch = useDispatch();

  const syncGlobalState: any = useCallback(
    debounce((localState: any, build: any) => {
      let stringifiedLocalState = localState;

      if (
        sanitizeString(build[configurationType]) !==
        sanitizeString(stringifiedLocalState)
      ) {
        dispatch(updateStoreConfiguration(stringifiedLocalState));
        dispatch(
          addUnsavedChanges({
            style: true,
          })
        );
      } else {
        dispatch(
          addUnsavedChanges({
            style: false,
          })
        );
      }
    }, 1000),
    [dispatch]
  );

  const syncLocalState = useCallback(async (configuration: any, type: any) => {
    try {
      let prettifiedState = await prettify(configuration, "css");
      let parsedState = cssToObject(configuration);

      dispatchConfig({
        type: "SET_BOTH",
        payload: {
          parsed: parsedState,
          stringified: prettifiedState,
        },
      });
    } catch (e) {
      console.error(e);
      dispatchConfig({
        type: "SET_STRINGIFIED",
        payload: configuration,
      });
    }
  }, []);

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    if (view === "demo" || view === "preview") {
      panelRef.current?.resize(0);
    } else if (view === "developer") {
      panelRef.current?.resize(50);
    }
  }, [view]);

  useEffect(() => {
    if (config.parsed !== null) {
      syncGlobalState(config.stringified, build);
    }
  }, [config.stringified]);

  useEffect(() => {
    syncLocalState(storeConfiguration, configurationType);
  }, [reset]);

  const handlePrettify = useCallback(async () => {
    try {
      let prettifiedString = await prettify(config.stringified, "css");
      dispatchConfig({
        type: "SET_STRINGIFIED",
        payload: prettifiedString,
      });
    } catch (e) {
      console.error(e);
      dispatchConfig({
        type: "SET_STRINGIFIED",
        payload: config.stringified,
      });
    }
  }, [config.stringified]);

  const handleVersionChange = useCallback(
    (value: any) => {
      dispatch(
        addUnsavedChanges({
          style: adyenWebVersion !== value,
        })
      );
      dispatch(updateAdyenWebVersion(value));
    },
    [adyenWebVersion, dispatch]
  );

  const handleOpenApiSearchChange = useCallback((filteredProperties: any) => {
    setFilteredProperties(filteredProperties);
  }, []);

  const handleOpenCssListChange = useCallback(
    async (value: any) => {
      const configParameters = Object.keys(config.parsed);
      const isNewProperty = configParameters.length < value.length;
      if (isNewProperty) {
        const latestKey = value[value.length - 1];
        const latestValue = properties[latestKey];
        let newProperty = null;
        if (latestValue.type === "class") {
          newProperty = { [latestKey]: {} };
        } else if (latestValue.type === "color") {
          newProperty = { [latestKey]: "" };
        } else if (latestValue.type === "enum") {
          newProperty = { [latestKey]: "" };
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
              formatCssString(objectToCSS(newObject)),
              "css"
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

          let prettifiedString = await prettify(
            formatCssString(objectToCSS(updatedRequest)),
            "css"
          );
          dispatchConfig({
            type: "SET_BOTH",
            payload: {
              parsed: updatedRequest,
              stringified: prettifiedString,
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
            type="style"
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
            className={`rounded-none border-l-[2px] h-[var(--custom-prettify-height)]`}
            onClick={handlePrettify}
          >
            <span className="font-semibold text-xxs text-warning">{"{ }"}</span>
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
        {adyenWebVersion && (
          <Version
            label={"adyen web"}
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
        )}
        {!properties && <Loading className="text-foreground" />}
        {properties && (
          <div className="border-b-2 flex text-sm text-foreground">
            <span className="border-r-2 p-[3px]">
              <p className="inline-block border border-info border-dotted px-2 text-sm">
                class
              </p>
            </span>
          </div>
        )}
        {properties && (
          <Search
            properties={properties}
            onChange={handleOpenApiSearchChange}
            description={description}
            label={configurationType}
            method="css"
          />
        )}
        {filteredProperties && (
          <MemoizedOpenCssList
            properties={filteredProperties}
            selectedProperties={Object.keys(config.parsed)}
            values={config.parsed}
            disabled={errors.style}
            setValues={async (value: any) => {
              const stringifiedAndFormatted = formatCssString(
                objectToCSS(value)
              );
              const prettifiedString = await prettify(
                stringifiedAndFormatted,
                "css"
              );
              dispatchConfig({
                type: "SET_BOTH",
                payload: {
                  parsed: value,
                  stringified: prettifiedString,
                },
              });
            }}
            onChange={handleOpenCssListChange}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
const MemoizedOpenCssList = memo(OpenCssList);

export default Style;
