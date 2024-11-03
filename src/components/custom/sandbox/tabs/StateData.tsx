import Code from "@/components/custom/sandbox/editors/Code";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import {
  debounce,
  prettify,
  replaceKeyValue,
  sanitizeString,
  stringifyObject,
  unstringifyObject,
} from "@/utils/utils";

const StateData = (props: any) => {
  const { theme } = props;
  const { componentState } = useSelector((state: RootState) => state.component);
  const [formattedCode, setFormattedCode] = useState<any>(
    JSON.stringify(componentState)
  );

  useEffect(() => {
    const stringAndPrettify = debounce(async () => {
      const stringified = stringifyObject(componentState);
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
