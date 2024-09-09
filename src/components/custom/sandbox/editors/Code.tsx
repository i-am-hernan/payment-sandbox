import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { githubLight } from "@uiw/codemirror-theme-github";
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
  const { code, type, readOnly, onChange } = props;
  const [formattedCode, setFormattedCode] = useState<string>("");

  const prettify = async (uglyCode: string, type: string): Promise<string> => {
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
      const formatted = await prettify(code, type);
      setFormattedCode(formatted);
    };
    formatCode();
  }, [code]);

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const handleChange = debounce(async (value: string, type: string) => {
    try {
      // Linter logic
      let diagnostics: Diagnostic[] = [];
      let parsedValue = null;
      if (type === "json") {
        diagnostics = await jsonLinter({
          state: { doc: { toString: () => value } },
        });
        parsedValue = diagnostics.length === 0 ? jsonc.parse(value): null;
      } else if (type === "javascript") {
        diagnostics = await javascriptLinter({
          state: { doc: { toString: () => value } },
        });
        parsedValue = diagnostics.length === 0 ? parse(value, { sourceType: "module" }): null;
      }

      // Update global state if no linter error
      // I need the value to be the parsed version of the string
      if (parsedValue) {
        onChange(parsedValue);
      }
    } catch (error) {
      console.error("Error in handleChange:", error);
    }
  }, 3000); // Adjust the debounce delay as needed

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

  if (readOnly) {
    extensions.push(
      EditorView.theme({
        ".cm-content": {
          caretColor: "transparent", // Hides the caret (cursor)
        },
        ".cm-line": {
          userSelect: "none", // Prevents text selection
        },
      })
    );
  } else {
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
    <div className="flex">
      <div className="flex codemirror-wrapper">
        <CodeMirror
          value={formattedCode}
          height="100%"
          readOnly={readOnly}
          theme={githubLight}
          extensions={extensions}
        />
      </div>
    </div>
  );
};

export default Code;
