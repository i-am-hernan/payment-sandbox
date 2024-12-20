import Code from "@/components/custom/sandbox/editors/Code";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { prettify } from "@/utils/utils";

const Network = (props: any) => {
  const { theme } = props;
  const { networkResponse } = useSelector((state: RootState) => state.sandbox);
  const [formattedCode, setFormattedCode] = useState<any>(JSON.stringify(networkResponse));

  useEffect(() => {
    const stringAndPrettify = async () => {
      const stringified = JSON.stringify(networkResponse);
      setFormattedCode(await prettify(stringified, "json"));
    };
    stringAndPrettify();
  }, [networkResponse]);

  return (
    <div className="flex h-[100%] border-b-2">
      {/* TODO: refactor this so I'm able to take in array of network responses and make it collapsible */}
      <Code code={formattedCode} theme={theme} type="json" readOnly={true} />
    </div>
  );
};

export default Network;
