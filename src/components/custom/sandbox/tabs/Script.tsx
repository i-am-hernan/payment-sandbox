import { WEBVERSIONS } from "@/assets/constants/constants";
import Code from "@/components/custom/sandbox/editors/Code";
import OpenApiSearch from "@/components/custom/sandbox/editors/openApi/OpenApiSearch";
import Version from "@/components/custom/sandbox/editors/Version";
import Loading from "@/components/custom/utils/Loading";
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
  sanitizeString,
  stringifyObject,
  unstringifyObject
} from "@/utils/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OpenSdkList } from "../editors/openSdk/OpenSdkList";

const { updateSpecs } = specsActions;
const {
  updateReset,
  addUnsavedChanges,
  updateAdyenWebVersion,
  updateTxVariantConfiguration,
  updateCheckoutConfiguration,
} = formulaActions;

const Script = () => {
  const {
    reset,
    build,
    checkoutConfiguration: globalCheckoutConfiguration,
    txVariantConfiguration,
    adyenWebVersion,
  } = useSelector((state: RootState) => state.formula);

  const { adyenWeb }: any = useSelector((state: RootState) => state.specs);
  const { theme } = useSelector((state: RootState) => state.user);
  const { variant } = useParams<{
    variant: string;
  }>();
  const properties = adyenWeb?.checkout ?? null;
  const dispatch = useDispatch();
  const [checkoutConfiguration, setCheckoutConfiguration] = useState(
    unstringifyObject(globalCheckoutConfiguration)
  );
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
  const variantConfigurationVar = `${variant}Configuration`;
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
    const syncGlobalState: any = debounce((localState: any, build: any) => {
      let stringifiedLocalState = stringifyObject(localState);

      const isEqual =
        sanitizeString(build.checkoutConfiguration) ===
        sanitizeString(stringifiedLocalState);

      if (!isEqual) {
        dispatch(updateCheckoutConfiguration(stringifiedLocalState));
      }
      dispatch(
        addUnsavedChanges({
          js: !isEqual,
        })
      );
    }, 1800);

    const syncLocalState = () => {
      setCheckoutConfiguration(unstringifyObject(globalCheckoutConfiguration));
      dispatch(updateReset(false));
    };

    if (reset) {
      syncLocalState();
    } else {
      syncGlobalState(checkoutConfiguration, build);
    }
  }, [checkoutConfiguration, reset]);

  if (sdkSpecsError) {
    return <div>Error</div>;
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block !overflow-y-scroll"
    >
      <ResizablePanel defaultSize={50} className="sm:flex bg-code">
        <div className="flex flex-col w-[100%]">
          <div className="text-[13px] text-grey pl-10 font-mono overflow-hidden">
            <div className="text-reserved">
              {"// create a configuration object"}
            </div>
          </div>
          <Code
            type="javascript"
            code={`var ${checkoutConfigurationVar} = ${stringifyObject(checkoutConfiguration)};`}
            readOnly={false}
            theme={theme}
            onChange={(value: any) => {
              setCheckoutConfiguration(value);
            }}
            jsVariable={checkoutConfigurationVar}
          />
          <div className="text-[13px] text-grey pl-10 font-mono overflow-hidden cursor-not-allowed">
            <div className="text-reserved">
              {"// create an instance of checkout"}
            </div>
            <div className="break-words pb-2">
              <span className="text-reserved">{"var "}</span>
              <span className="text-variable">{"checkout"}</span>
              <span className="text-reserved">{" = "}</span>
              <span className="text-reserved">{" new "}</span>
              <span className="text-variable">{"window"}</span>
              <span className="text-reserved">{"."}</span>
              <span className="text-property">{"AdyenCheckout"}</span>
              <span className="text-reserved">{"("}</span>
              <span className="text-variable">{"checkoutConfiguration"}</span>
              <span className="text-reserved">{")"}</span>
              <span className="text-variable">{";"}</span>
            </div>
            <div className="text-reserved pt-2">
              {`// create a ${variant} configuration object`}
            </div>
          </div>

          <Code
            type="javascript"
            code={`var ${variantConfigurationVar} = {};`}
            readOnly={false}
            theme={theme}
            onChange={(value: any) => {
              console.log(value);
            }}
            jsVariable={variantConfigurationVar}
          />
          <div className="text-[13px] text-grey pl-7 font-mono overflow-hidden cursor-not-allowed">
            <div className="text-reserved">
              {"// create and mount component"}
            </div>
            <div className="break-words">
              <span className="text-reserved">{"var "}</span>
              <span className="text-variable">{variant}</span>
              <span className="text-reserved">{" = "}</span>
              <span className="text-variable">{" checkout"}</span>
              <span className="text-reserved">{"."}</span>
              <span className="text-property">{"create"}</span>
              <span className="text-reserved">{"("}</span>
              <span className="text-variable">{`'${variant}'`}</span>
              <span className="text-variable">{`, ${variant}Configuration`}</span>
              <span className="text-reserved">{")"}</span>
              <span className="text-variable">{";"}</span>
            </div>
          </div>
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
        {!loadingSdkSpecData && sdkSpecsData && (
          <OpenSdkList
            openSdk={sdkSpecsData}
            properties={filteredProperties}
            selectedProperties={Object.keys(checkoutConfiguration)}
            values={checkoutConfiguration}
            setValues={(value: any) => {
              setCheckoutConfiguration(value);
            }}
            onChange={(value: any) => {
              const checkoutParameters = Object.keys(checkoutConfiguration);
              const isNewProperty = checkoutParameters.length < value.length;
              if (isNewProperty) {
                const latestKey = value[value.length - 1];

                const latestValue = properties[latestKey];
                let newProperty = null;
                if (latestValue.type === "string") {
                  newProperty = { [latestKey]: "" };
                  setCheckoutConfiguration({
                    ...checkoutConfiguration,
                    ...newProperty,
                  });
                } else if (latestValue.type === "boolean") {
                  newProperty = { [latestKey]: true };
                  setCheckoutConfiguration({
                    ...checkoutConfiguration,
                    ...newProperty,
                  });
                } else if (latestValue.type === "integer") {
                  newProperty = { [latestKey]: 0 };
                  setCheckoutConfiguration({
                    ...checkoutConfiguration,
                    ...newProperty,
                  });
                } else if (latestValue.type === "array") {
                  newProperty = { [latestKey]: [] };
                  setCheckoutConfiguration({
                    ...checkoutConfiguration,
                    ...newProperty,
                  });
                } else if (!latestValue.type) {
                  newProperty = { [latestKey]: {} };
                  setCheckoutConfiguration({
                    ...checkoutConfiguration,
                    ...newProperty,
                  });
                } else if (latestValue.type === "object") {
                  newProperty = { [latestKey]: {} };
                  setCheckoutConfiguration({
                    ...checkoutConfiguration,
                    ...newProperty,
                  });
                } else if (latestValue.type === "function") {
                  newProperty = { [latestKey]: function () {} };
                  setCheckoutConfiguration({
                    ...checkoutConfiguration,
                    ...newProperty,
                  });
                }
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
