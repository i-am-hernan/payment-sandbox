import { ManageEditors } from "@/components/custom/sandbox/editors/manageEditors";
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { formulaActions } from "@/store/reducers";
import { createHtmlCode } from "@/lib/utils";
import { useParams } from "next/navigation";
import { WEBVERSIONS } from "@/assets/constants/constants";

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
      version={adyenWebVersion}
      versions={WEBVERSIONS}
      versionTitle="Adyen Web Version"
      specs={null}
      onChange={(value: any) => {
        dispatch(updateFormula(value));
      }}
    />
  );
};

export default HTML;
