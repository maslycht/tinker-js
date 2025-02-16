import path from "path";
import { Command } from "commander";
import { serve } from "local-api";
import * as process from "node:process";

export const serveCommand = new Command()
  .command("serve [filename]")
  .description("open a file for editing")
  .option("-p, --port <port>", "port of the server", "4005")
  .action((filename = "notebook.tjs", options: { port: string }) => {
    const dir = path.isAbsolute(filename)
      ? path.dirname(filename)
      : path.join(process.cwd(), path.dirname(filename));
    serve(parseInt(options.port), path.basename(filename), dir);
  });
