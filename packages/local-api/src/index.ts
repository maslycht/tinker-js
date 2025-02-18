import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { createCellsRouter } from "./routes/cells";

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean,
) => {
  const app = express();

  app.use(createCellsRouter(filename, dir));

  if (useProxy) {
    // proxying local vite project for development
    app.use(
      createProxyMiddleware({
        target: "http://localhost:5173",
        ws: true,
      }),
    );
  } else {
    // serving built UI in production
    const uiDist = path.join(
      require.resolve("@tinker-js/ui/package.json"),
      "../dist",
    );

    app.use(express.static(uiDist));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, () => resolve()).on("error", reject);
  });
};
