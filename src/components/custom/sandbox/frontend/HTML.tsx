import { PanelManager } from "@/components/custom/sandbox/layout/mainPanels/panelManager";
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { formulaActions } from "@/store/reducers";


const { updateFormula } = formulaActions;

const HTML = () => {
  const { adyenWebVersion } = useSelector(
    (state: RootState) => state.formula
  );

  const dispatch = useDispatch();

  return (
    <PanelManager
      type="html"
      value={{ adyenWebVersion: adyenWebVersion }}
      codePrefix=""
      codePostfix=""
      specs={data}
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
