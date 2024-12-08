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
import { createHtmlCode } from "@/utils/utils";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const { updateAdyenWebVersion, addUnsavedChanges } = formulaActions;

const Html = () => {
  const { adyenWebVersion, build } = useSelector(
    (state: RootState) => state.formula
  );
  const { theme, view } = useSelector((state: RootState) => state.user);
  const { variant } = useParams<{
    variant: string;
  }>();

  const handleVersionChange = (value: any) => {
    dispatch(addUnsavedChanges({ html: build.adyenWebVersion !== value }));
    dispatch(updateAdyenWebVersion(value));
  };
  const dispatch = useDispatch();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="inline-block overflow-y-scroll"
    >
      <ResizablePanel
        defaultSize={view === "developer" ? 50 : 0}
        maxSize={view === "developer" ? 100 : 0}
        className="sm:flex"
      >
        <Code
          type="html"
          code={createHtmlCode(adyenWebVersion, variant)}
          readOnly={true}
          theme={theme}
        />
      </ResizablePanel>
      {view === "developer" && <ResizableHandle />}
      <ResizablePanel defaultSize={50}>
        <Version
          label={"Adyen Web"}
          value={adyenWebVersion}
          options={WEBVERSIONS}
          onChange={handleVersionChange}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Html;
