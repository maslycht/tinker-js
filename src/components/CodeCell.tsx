import { useState } from "react";
import CodeEditor from "./CodeEditor";
import Preview from "./Preview.tsx";
import bundle from "../bundler";

function CodeCell() {
  const [rawCode, setRawCode] = useState("import 'bulma/css/bulma.css'");
  const [bundledCode, setBundledCode] = useState("");

  const onClick = async () => {
    const bundledCode = await bundle(rawCode);
    setBundledCode(bundledCode);
  };

  return (
    <div>
      <CodeEditor
        initialValue={rawCode}
        onChange={(value) => {
          setRawCode(value);
        }}
      />

      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <Preview code={bundledCode} />
    </div>
  );
}

export default CodeCell;
