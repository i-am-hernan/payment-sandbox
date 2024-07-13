import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { EditorView } from "@codemirror/view";
import * as prettier from "prettier/standalone";
import * as parserBabel from "prettier/parser-babel";
import * as prettierPluginEstree from "prettier/plugins/estree";

const AdyenState = () => {
  const { variantState } = useSelector(
    (state: RootState) => state.adyenVariant
  );
  const [formattedCode, setFormattedCode] = useState<string>("");

  const prettify = async (json: any): Promise<string> => {
    try {
      const prettierVersion = prettier.format(JSON.stringify(json), {
        parser: "json",
        plugins: [parserBabel, prettierPluginEstree],
        tabWidth: 4,
        useTabs: false,
      });
      return prettierVersion;
    } catch (error) {
      console.error("Prettier formatting error: ", error);
      return JSON.stringify(json, null, 4); // Fallback to basic formatting
    }
  };

  useEffect(() => {
    const formatCode = async () => {
      const formatted = await prettify(variantState);
      setFormattedCode(formatted);
    };
    formatCode();
  }, [variantState]);

  return (
    <div className="flex">
      <div className="flex codemirror-wrapper pb-5">
        <CodeMirror
          value={formattedCode}
          height="100%"
          theme={githubLight}
          extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
        />
      </div>
    </div>
  );
};

export default AdyenState;
