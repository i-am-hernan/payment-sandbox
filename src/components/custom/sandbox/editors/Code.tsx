import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { githubLight } from "@uiw/codemirror-theme-github";
import { abyss } from "@uiw/codemirror-theme-abyss";
import CodeMirror from "@uiw/react-codemirror";
import * as parserBabel from "prettier/parser-babel";
import * as parserHtml from "prettier/parser-html";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettier from "prettier/standalone";
import { useEffect, useState } from "react";
import { linter, Diagnostic } from "@codemirror/lint";
import { parse } from "@babel/parser"; // Import a JavaScript parser
import * as jsonc from "jsonc-parser"; // Import jsonc-parser

const Code = (props: any) => {
  const { code, type, readOnly, onChange, theme } = props;
  const [formattedCode, setFormattedCode] = useState<string>("");

  const prettify = async (uglyCode: string, type: string): Promise<string> => {
    try {
      const prettierVersion = prettier.format(uglyCode, {
        parser: type,
        plugins: [parserBabel, parserHtml, prettierPluginEstree, jsonc],
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
    const formatCode: any = async () => {
      let prettifyType = type;
      if (type === "html") {
        prettifyType = "html";
      } else if(type === "json") {
        prettifyType = "json";
      } else if (type === "javascript") {
        prettifyType = "babel";
      }

      const formatted = await prettify(code, prettifyType);
      setFormattedCode(formatted);

    };
    formatCode();
  }, [code]);

  const handleChange = async (value: string, type: string) => {
    try {
      // Linter logic
      let diagnostics: Diagnostic[] = [];
      let parsedValue = null;
      if (type === "json") {
        diagnostics = await jsonLinter({
          state: { doc: { toString: () => value } },
        });
        parsedValue = diagnostics.length === 0 ? jsonc.parse(value) : null;
      } else if (type === "javascript") {
        diagnostics = await javascriptLinter({
          state: { doc: { toString: () => value } },
        });
        parsedValue =
          diagnostics.length === 0
            ? parse(value, { sourceType: "module" })
            : null;
      }
      if (parsedValue) {
        onChange(parsedValue);
      }
    } catch (error) {
      console.error("Error in handleChange:", error);
    }
  };

  const jsonLinter = async (view: any) => {
    const diagnostics: Diagnostic[] = [];
    const code = view.state.doc.toString();

    const errors = jsonc.visit(code, {
      onError: (error, offset, length) => {
        diagnostics.push({
          from: offset,
          to: offset + length,
          severity: "error",
          message: jsonc.printParseErrorCode(error),
        });
      },
    });
    return diagnostics;
  };

  const javascriptLinter = async (view: any) => {
    const diagnostics: Diagnostic[] = [];
    const code = view.state.doc.toString();
    try {
      const ast = parse(code, { sourceType: "module" });
    } catch (error: any) {
      diagnostics.push({
        from: error.loc.start.column,
        to: error.loc.end.column,
        severity: "error",
        message: error.message,
      });
    }
    return diagnostics;
  };

  const extensions = [];

  if (!readOnly) {
    extensions.push(
      EditorView.updateListener.of((update: ViewUpdate) => {
        if (update.docChanged) {
          handleChange(update.state.doc.toString(), type);
        }
      }),
      EditorView.lineWrapping
    );
  }

  if (type === "html") {
    extensions.push(javascript({ jsx: true }));
  } else if (type === "json") {
    extensions.push(json(), linter(jsonLinter));
  } else if (type === "javascript") {
    extensions.push(javascript(), linter(javascriptLinter));
  }

  return (
    <div className="flex w-[100%] codemirror-wrapper">
      <CodeMirror
        value={formattedCode}
        height="100%"
        readOnly={readOnly}
        theme={theme === "light" ? githubLight : abyss}
        extensions={extensions}
      />
    </div>
  );
};

export default Code;
