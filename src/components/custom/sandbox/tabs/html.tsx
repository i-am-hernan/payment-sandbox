import { WEBVERSIONS } from "@/assets/constants/constants";
import { ManageEditors } from "@/components/custom/sandbox/editors/manageEditors";
import { createHtmlCode } from "@/lib/utils";
import { formulaActions } from "@/store/reducers";
import type { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const { updateAdyenWebVersion } = formulaActions;

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
        const { adyenWebVersion } = value;
        if (adyenWebVersion) {
          dispatch(updateAdyenWebVersion(adyenWebVersion));
        }
      }}
    />
  );
};

export default HTML;
