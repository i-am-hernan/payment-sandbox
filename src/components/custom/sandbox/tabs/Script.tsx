import { useApi } from "@/hooks/useApi";
import { formulaActions, specsActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Code from "@/components/custom/sandbox/editors/Code";
import { debounce, deepEqual } from "@/utils/utils";
import Loading from "@/components/custom/utils/Loading";
import Version from "@/components/custom/sandbox/editors/Version";
import { WEBVERSIONS } from "@/assets/constants/constants";
import { OpenSdkList } from "../editors/openSdk/OpenSdkList";
import OpenApiSearch from "@/components/custom/sandbox/editors/openApi/OpenApiSearch";

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
  const properties = adyenWeb?.checkout ?? null;
  const dispatch = useDispatch();
  const [checkoutConfiguration, setCheckoutConfiguration] = useState(
    globalCheckoutConfiguration
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

  if (sdkSpecsError) {
    return <div>Error</div>;
  }

  function serializeWithFunctions(obj: any) {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === "function") {
        return value.toString();
      }
      return value;
    });
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block !overflow-y-scroll"
    >
      <ResizablePanel defaultSize={50} className="sm:flex bg-code">
        <div className="flex flex-col w-[100%]">
          <Code
            type="javascript"
            code={`// create a configuration object \n\nvar checkoutConfiguration = ${serializeWithFunctions(checkoutConfiguration)};`}
            readOnly={false}
            theme={theme}
            onChange={(value: any) => {}}
          />
          <div className="text-[13px] text-grey pl-7 font-mono overflow-hidden">
            <div className="text-reserved pb-2">
              {"// create an instance of checkout"}
            </div>
            <div className="break-words">
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
                // We are using a key to get the value of the property, but its an aarray

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
