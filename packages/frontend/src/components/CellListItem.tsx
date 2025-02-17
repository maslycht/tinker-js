import "./cell-list-item.css";
import { ReactElement } from "react";
import { Cell } from "../state";
import CodeCell from "./CodeCell.tsx";
import TextEditor from "./TextEditor.tsx";
import ActionBar from "./ActionBar.tsx";

interface CellListItemProps {
  cell: Cell;
}

const CellListItem = ({ cell }: CellListItemProps) => {
  const child: ReactElement =
    cell.type === "code" ? (
      <>
        <div className={"action-bar-wrapper"}>
          <ActionBar cellId={cell.id} />
        </div>
        <CodeCell key={cell.id} cell={cell} />
      </>
    ) : (
      <>
        <TextEditor key={cell.id} cell={cell} />
        <ActionBar cellId={cell.id} />
      </>
    );

  return <div className={"cell-list-item"}>{child}</div>;
};

export default CellListItem;
