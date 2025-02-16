import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkgPathPlugin.ts";
import { fetchPlugin } from "./plugins/fetchPlugin.ts";

let esbuildInitialized = false;

const bundle = async (rawCode: string) => {
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

  try {
    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        "process.env.NODE_ENV": "'production'",
        global: "window",
      },
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });

    return {
      bundledCode: result.outputFiles[0].text,
      error: "",
    };
  } catch (error) {
    if (error instanceof Error) {
      return { bundledCode: "", error: error.message };
    } else {
      throw error;
    }
  }
};

export default bundle;
