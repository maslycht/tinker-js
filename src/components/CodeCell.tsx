import { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import Preview from "./Preview.tsx";
import bundle from "../bundler";
import Resizable from "./Resizable.tsx";

function CodeCell() {
  const [rawCode, setRawCode] = useState("import 'bulma/css/bulma.css'");
  const [bundledCode, setBundledCode] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      const result = await bundle(rawCode);
      setBundledCode(result);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [rawCode]);

  return (
    <Resizable direction={"vertical"}>
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction={"horizontal"}>
          <CodeEditor
            initialValue={rawCode}
            onChange={(value) => {
              setRawCode(value);
            }}
          />
        </Resizable>

        <Preview code={bundledCode} />
      </div>
    </Resizable>
  );
}

export default CodeCell;
