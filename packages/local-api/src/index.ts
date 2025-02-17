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
    // serving built frontend in production
    const frontendDist = path.join(
      require.resolve("frontend/package.json"),
      "../dist",
    );

    app.use(express.static(frontendDist));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, () => resolve()).on("error", reject);
  });
};
