import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import * as parserBabel from "prettier/parser-babel";
import * as parserHtml from "prettier/parser-html";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettier from "prettier/standalone";
import { useEffect, useState } from "react";

// Needs a read only mode, and write mode
const Ide = (props: any) => {
  const { code, type, readOnly } = props;
  const [formattedCode, setFormattedCode] = useState<string>("");
  const extensions = [javascript({ jsx: true }), EditorView.lineWrapping];
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

  // if(!readOnly){
  //   extensions.push(EditorView.updateListener.of((update) => {
  //     if (update.docChanged) {
  //       prettify(update.state.doc.toString()).then((formatted) => {
  //         setFormattedCode(formatted);
  //       });
  //     }
  //   }));
  // }

  if (readOnly) {
    extensions.push(
      EditorView.theme({
        ".cm-content": {
          caretColor: "transparent",
        },
      })
    );
  }

  return (
    <div className="flex">
      <div className="flex codemirror-wrapper pb-5">
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

export default Ide;
