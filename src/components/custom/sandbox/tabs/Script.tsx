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
    checkoutConfiguration,
    txVariantConfiguration,
    adyenWebVersion,
  } = useSelector((state: RootState) => state.formula);

  const { adyenWeb }: any = useSelector((state: RootState) => state.specs);
  const { theme } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { data: sdkSpecsData, error: sdkSpecsError } = useApi(
    `api/specs/adyen-web/v${adyenWebVersion.replaceAll(".", "_")}/checkout`,
    "GET"
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

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="bg-background inline-block !overflow-y-scroll"
    >
      <ResizablePanel defaultSize={50} className="sm:flex bg-code">
        <div className="flex flex-col w-[100%]">
          <Code
            type="javascript"
            code={`// create a configuration object \n\nvar checkoutConfiguration = ${JSON.stringify(checkoutConfiguration, null, 4)};`}
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
        world
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Script;
