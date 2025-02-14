import { useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

function App() {
  const esbuildInitialized = useRef(false);
  const iframe = useRef<any>();
  const [input, setInput] = useState("import 'bulma/css/bulma.css'");

  useEffect(() => {
    const initializeEsbuild = async () => {
      await esbuild.initialize({
        worker: true,
        wasmURL: "https://unpkg.com/esbuild-wasm/esbuild.wasm",
      });
    };

    initializeEsbuild()
      .then(() => (esbuildInitialized.current = true))
      .catch(console.error);
  }, []);

  const onClick = async () => {
    if (!esbuildInitialized) return;

    iframe.current.srcdoc = html;

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

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };

  const html = `
    <html lang="en">
    <head>
      <title>Executed Code</title>
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener("message", (e) => {
          try {
            eval(e.data)
          } catch (e) {
            const root = document.getElementById("root");
            root.innerHTML = "<div style='color: red;'><h4>Runtime Error</h4>" + e + "</div>";
            console.error(e);
          }
        }, false);
      </script>
    </body>
    </html>
  `;

  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        title="Rendered Code"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  );
}

export default App;
