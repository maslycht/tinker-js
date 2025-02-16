import "./action-bar.css";
import { deleteCell, moveCell } from "../state";
import ActionButton from "./ActionButton.tsx";

interface ActionBarProps {
  cellId: string;
}

const ActionBar = ({ cellId }: ActionBarProps) => {
  return (
    <div className={"action-bar"}>
      <ActionButton
        type={"moveUp"}
        action={moveCell({ cellId, direction: "up" })}
      />
      <ActionButton
        type={"moveDown"}
        action={moveCell({ cellId, direction: "down" })}
      />
      <ActionButton type={"delete"} action={deleteCell(cellId)} />
    </div>
  );
};

export default ActionBar;
