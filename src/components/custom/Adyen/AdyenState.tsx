import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";

const extensions = [javascript({ jsx: true })];

const AdyenState = () => {
  return (
    <div className="flex">
      <div className="flex codemirror-wrapper ">
        <CodeMirror
          value="console.log('hello world!');"
          height="100%"
          theme={githubLight}
          extensions={[javascript({ jsx: true })]}
        />
      </div>
    </div>
  );
};

export default AdyenState;
