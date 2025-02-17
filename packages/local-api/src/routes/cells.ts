import express from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

interface LocalApiError {
  code: string;
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const filePath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    const isLocalApiError = (err: any): err is LocalApiError => {
      return typeof err.code === "string";
    };

    try {
      const result = await fs.readFile(filePath, "utf8");

      res.send(JSON.parse(result));
    } catch (error) {
      if (isLocalApiError(error)) {
        if (error.code === "ENOENT") {
          await fs.writeFile(filePath, "[]", "utf-8");
          res.send([]);
        }
      } else {
        throw error;
      }
    }
  });

  router.post("/cells", async (req, res) => {
    const { cells }: { cells: Cell[] } = req.body;

    await fs.writeFile(filePath, JSON.stringify(cells), "utf8");

    res.sendStatus(200);
  });

  return router;
};
