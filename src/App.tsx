import { useEffect, useState } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

function App() {
  const [esbuildInitialized, setEsbuildInitialized] = useState(false);
  const [input, setInput] = useState("const App = () => <div>Tinker JS</div>");
  const [code, setCode] = useState("");

  const initializeEsbuild = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm/esbuild.wasm",
    });
  };

  useEffect(() => {
    initializeEsbuild()
      .then(() => setEsbuildInitialized(true))
      .catch(console.error);
  }, []);

  const onClick = async () => {
    if (!esbuildInitialized) return;

    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": "'production'",
        global: "window",
      },
    });

    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

export default App;
