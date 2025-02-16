import "./code-cell.css";
import { useEffect } from "react";
import CodeEditor from "./CodeEditor";
import Resizable from "./Resizable.tsx";
import { Cell, updateCell } from "../state";
import { useAppDispatch } from "../hooks/useAppDispatch.ts";
import { bundleCode } from "../state/slices/bundlesSlice.ts";
import { useTypedSelector } from "../hooks/useTypedSelector.ts";
import Preview from "./Preview.tsx";
import { selectCumulativeCode } from "../state/selectors/cellsSelectors.ts";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell = ({ cell }: CodeCellProps) => {
  const dispatch = useAppDispatch();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cumulativeCode = useTypedSelector((state) =>
    selectCumulativeCode(state, cell.id),
  );

  useEffect(
    () => {
      if (!bundle) {
        dispatch(
          bundleCode({ cellId: cell.id, rawCode: cumulativeCode.join("\n") }),
        );
        return;
      }

      const timer = setTimeout(async () => {
        dispatch(
          bundleCode({ cellId: cell.id, rawCode: cumulativeCode.join("\n") }),
        );
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cell.id, cumulativeCode.join("\n"), dispatch],
  );

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
        <div className={"progress-wrapper"}>
          {!bundle || bundle.loading ? (
            <div className={"progress-cover"}>
              <progress
                className={"progress is-small is-primary"}
                max={"100"}
              />
            </div>
          ) : (
            <Preview code={bundle.code} error={bundle.error} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
