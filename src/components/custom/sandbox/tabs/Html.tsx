import { WEBVERSIONS } from "@/assets/constants/constants";
import Code from "@/components/custom/sandbox/editors/Code";
import Version from "@/components/custom/sandbox/editors/Version";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { formulaActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { cn, createHtmlCode } from "@/utils/utils";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImperativePanelHandle } from "react-resizable-panels";

const { updateAdyenWebVersion, addUnsavedChanges } = formulaActions;

const Html = () => {
  const { adyenWebVersion, build } = useSelector(
    (state: RootState) => state.formula
  );
  const { theme, view } = useSelector((state: RootState) => state.user);
  const { variant } = useParams<{
    variant: string;
  }>();
  const panelRef = useRef<ImperativePanelHandle>(null);

  const handleVersionChange = (value: any) => {
    dispatch(addUnsavedChanges({ html: build.adyenWebVersion !== value }));
    dispatch(updateAdyenWebVersion(value));
  };
  const dispatch = useDispatch();

  if (view === "demo" || view === "preview") {
    panelRef.current?.resize(0);
  } else if (view === "developer") {
    panelRef.current?.resize(50);
  }
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="inline-block overflow-y-scroll"
    >
      <ResizablePanel
        defaultSize={view === "developer" ? 50 : 0}
        maxSize={view === "developer" ? 100 : 0}
        className={cn(
          "sm:flex bg-code flex-col items-stretch transition-all duration-300 ease-in-out",
          view === "demo" && "opacity-0"
        )}
        ref={panelRef}
      >
        <Code
          type="html"
          code={createHtmlCode(adyenWebVersion, variant)}
          readOnly={true}
          theme={theme}
        />
      </ResizablePanel>
      <ResizableHandle
        className={cn(
          view !== "developer" && "opacity-0 pointer-events-none hidden"
        )}
      />
      <ResizablePanel>
        <Version
          label={"adyen web"}
          value={adyenWebVersion}
          options={WEBVERSIONS}
          onChange={handleVersionChange}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Html;
