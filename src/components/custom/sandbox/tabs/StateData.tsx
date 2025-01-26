import Code from "@/components/custom/sandbox/editors/Code";
import type { RootState } from "@/store/store";
import {
  debounce,
  prettify
} from "@/utils/utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const StateData = (props: any) => {
  const { theme } = props;
  const { componentState } = useSelector((state: RootState) => state.component);
  const [formattedCode, setFormattedCode] = useState<any>(
    JSON.stringify(componentState)
  );

  useEffect(() => {
    const stringAndPrettify = debounce(async () => {
      const stringified = JSON.stringify(componentState);
      setFormattedCode(await prettify(stringified, "json"));
    }, 500);
    stringAndPrettify();
  }, [componentState]);

  return (
    <div className="flex h-[100%]">
      <Code code={formattedCode} theme={theme} type="json" readOnly={true} />
    </div>
  );
};

export default StateData;
