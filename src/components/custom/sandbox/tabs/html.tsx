import { ManageEditors } from "@/components/custom/sandbox/editors/manageEditors";
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { formulaActions } from "@/store/reducers";
import { createHtmlCode } from "@/lib/utils";
import { useParams } from "next/navigation";

const { updateFormula } = formulaActions;

const HTML = () => {
  const { adyenWebVersion } = useSelector((state: RootState) => state.formula);
  const { variant } = useParams<{
    variant: string;
  }>();
  const dispatch = useDispatch();

  return (
    <ManageEditors
      type="html"
      value={{ adyenWebVersion: adyenWebVersion }}
      code={createHtmlCode(adyenWebVersion, variant)}
      specs={null}
      onChange={(config: any) => {
        const { adyenWebVersion } = config;
        dispatch(
          updateFormula({
            adyenWebVersion: adyenWebVersion,
          })
        );
      }}
    />
  );
};

export default HTML;
