import { FC, useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import Preview from "./Preview.tsx";
import bundle from "../bundler";
import Resizable from "./Resizable.tsx";
import { Cell, updateCell } from "../state";
import { useAppDispatch } from "../hooks/useAppDispatch.ts";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: FC<CodeCellProps> = ({ cell }) => {
  const dispatch = useAppDispatch();
  const [bundledCode, setBundledCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      const result = await bundle(cell.content);
      setBundledCode(result.bundledCode);
      setError(result.error);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction={"vertical"}>
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction={"horizontal"}>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) =>
              dispatch(updateCell({ cellId: cell.id, content: value }))
            }
          />
        </Resizable>

        <Preview code={bundledCode} error={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
