import { useEffect, useState } from "react";
import * as esbuild from "esbuild-wasm";

function App() {
  const [esbuildInitialized, setEsbuildInitialized] = useState(false);
  const [input, setInput] = useState("const App = () => <div>Tinker JS</div>");
  const [code, setCode] = useState("");

  const initializeEsbuild = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  };

  useEffect(() => {
    initializeEsbuild()
      .then(() => setEsbuildInitialized(true))
      .catch(console.error);
  }, []);

  const onClick = async () => {
    if (!esbuildInitialized) return;

    const result = await esbuild.transform(input, {
      loader: "jsx",
      target: "es2015",
    });

    setCode(result.code);
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
