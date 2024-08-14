import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";
import { EditorView } from "@codemirror/view";
import * as prettier from "prettier/standalone";
import * as parserBabel from "prettier/parser-babel";
import * as parserHtml from "prettier/parser-html";
import * as prettierPluginEstree from "prettier/plugins/estree";
import { html } from "@codemirror/lang-html";

const CodeEditor = (props: any) => {
  const { code, type } = props;
  const [formattedCode, setFormattedCode] = useState<string>("");

  const prettify = async (uglyCode: any): Promise<string> => {
    try {
      const prettierVersion = prettier.format(uglyCode, {
        parser: type,
        plugins: [parserBabel, parserHtml, prettierPluginEstree],
        tabWidth: 1,
        useTabs: false,
      });
      return prettierVersion;
    } catch (error) {
      console.error("Prettier formatting error: ", error);
      return JSON.stringify(uglyCode, null, 4); // Fallback to basic formatting
    }
  };

  useEffect(() => {
    const formatCode = async () => {
      const formatted = await prettify(code);
      setFormattedCode(formatted);
    };
    formatCode();
  }, [code]);

  return (
    <div className="flex">
      <div className="flex codemirror-wrapper pb-5">
        <CodeMirror
          value={formattedCode}
          height="100%"
          readOnly={true}
          theme={githubLight}
          extensions={[javascript({ jsx: true }), EditorView.lineWrapping]}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
