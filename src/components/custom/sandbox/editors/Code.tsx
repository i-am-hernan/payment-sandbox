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
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import * as jsonc from "jsonc-parser"; // Import jsonc-parser

const Code = (props: any) => {
  const { code, type, readOnly, onChange, theme } = props;
  const [formattedCode, setFormattedCode] = useState<string>("");

  // Need to prettify when user presses format button
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

  const getVariableValueFromAST = (code: string, variableName: string) => {
    // Parse the code to get the AST
    const ast = parse(code, { sourceType: "module" });

    let variableValue = null;

    // Traverse the AST to find the variable declaration
    traverse(ast, {
      VariableDeclarator(path: any) {
        if (t.isIdentifier(path.node.id, { name: variableName })) {
          // Evaluate the value of the variable
          variableValue = path.node.init;
          path.stop();
        }
      },
    });
    // Generate code from the AST node
    const { code: valueCode } = generate(variableValue);

    // Use eval to get the JavaScript object representation
    const evaluatedValue = eval(`(${valueCode})`);

    return evaluatedValue;
  };

  useEffect(() => {
    const formatCode: any = async () => {
      let prettifyType = type;
      if (type === "html") {
        prettifyType = "html";
      } else if (type === "json") {
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
      if (type === "json") {
        diagnostics = await jsonLinter({
          state: { doc: { toString: () => value } },
        });
        if (diagnostics.length === 0) {
          onChange(jsonc.parse(value));
        }
      } else if (type === "javascript") {
        diagnostics = await javascriptLinter({
          state: { doc: { toString: () => value } },
        });
        if (diagnostics.length === 0) {
          // Bug: What if the user doesn't have any bugs but also doesnt have checkout configuration in the code, we should still throw an error
          onChange(getVariableValueFromAST(value, "checkoutConfiguration"));
        }
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
      // Extract location information if available
      const from = error.loc
        ? getCharacterPosition(code, error.loc.line, error.loc.column)
        : 0;
      const to = from; // Assuming the error is at a single point
      diagnostics.push({
        from,
        to,
        severity: "error",
        message: error.message,
      });
    }
    return diagnostics;
  };

  // Helper function to convert line and column to character position
  const getCharacterPosition = (code: string, line: number, column: number) => {
    const lines = code.split("\n");
    let position = 0;
    for (let i = 0; i < line - 1; i++) {
      position += lines[i].length + 1; // +1 for the newline character
    }
    position += column;
    return position;
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
