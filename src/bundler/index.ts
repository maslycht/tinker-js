import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let esbuildInitialized = false;

const bundle = async (rawCode: string): Promise<string> => {
  if (!esbuildInitialized) {
    try {
      await esbuild.initialize({
        worker: true,
        wasmURL: "https://unpkg.com/esbuild-wasm/esbuild.wasm",
      });
      esbuildInitialized = true;
    } catch (error) {
      console.error("Failed to initialize ESBuild:", error);
    }
  }

  const result = await esbuild.build({
    entryPoints: ["index.js"],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    define: {
      "process.env.NODE_ENV": "'production'",
      global: "window",
    },
  });

  return result.outputFiles[0].text;
};

export default bundle;
