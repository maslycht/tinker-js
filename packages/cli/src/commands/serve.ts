import path from "path";
import { Command } from "commander";
import { serve } from "@tinker-js/local-api";
import { err, log } from "../utils/logging";

interface LocalApiError {
  code: string;
}

const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
  .command("serve [filename]")
  .description("open a file for editing")
  .option("-p, --port <port>", "port of the server", "4005")
  .action(async (filename = "notebook.tjs", options: { port: string }) => {
    const isLocalApiError = (error: any): error is LocalApiError => {
      return typeof error.code === "string";
    };

    try {
      const dir = path.isAbsolute(filename)
        ? path.dirname(filename)
        : path.join(process.cwd(), path.dirname(filename));

      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction,
      );

      log(
        `Opened ${path.join(dir, filename)}. Navigate to http://localhost:${options.port} to start tinkering!`,
      );
    } catch (error: any) {
      if (isLocalApiError(error)) {
        if (error.code === "EADDRINUSE") {
          err(
            `Port ${options.port} is already in use. Try running on a different port by specifying "--port <number>".`,
          );
        }
      } else if (error instanceof Error) {
        err("Unable to run the local API:", error.message);
      }
      process.exit(1);
    }
  });
