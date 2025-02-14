import { OnLoadArgs, OnLoadResult, PluginBuild } from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const cache = localforage.createInstance({
  name: "fetch-plugin-cache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: PluginBuild) {
      // return the input code if handling root "index.js" path
      build.onLoad({ filter: /^index\.js$/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      // return the cached contents for any file path if present
      build.onLoad({ filter: /.*/ }, async (args: OnLoadArgs) => {
        const cachedResult = await cache.getItem<OnLoadResult>(args.path);

        if (cachedResult) {
          return cachedResult;
        }
      });

      // fetch contents for CSS file paths
      build.onLoad({ filter: /\.css$/ }, async (args: OnLoadArgs) => {
        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        // NOTE: this will not work correctly for advanced CSS features like `@import` or `url()`
        const contents = `
            const style = document.createElement("style");
            style.innerText = '${escaped}'
            document.head.appendChild(style);
            `;

        const result: OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        await cache.setItem(args.path, result);

        return result;
      });

      // fetch contents for all the other file paths
      build.onLoad({ filter: /.*/ }, async (args: OnLoadArgs) => {
        const { data, request } = await axios.get(args.path);

        const result: OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        await cache.setItem(args.path, result);

        return result;
      });
    },
  };
};
