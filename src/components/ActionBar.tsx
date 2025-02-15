import { FC } from "react";
import { AppDispatch, deleteCell, moveCell } from "../state";
import { useDispatch } from "react-redux";

interface ActionBarProps {
  cellId: string;
}

const ActionBar: FC<ActionBarProps> = ({ cellId }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <button onClick={() => dispatch(moveCell({ cellId, direction: "up" }))}>
        Up
      </button>
      <button onClick={() => dispatch(moveCell({ cellId, direction: "down" }))}>
        Down
      </button>
      <button onClick={() => dispatch(deleteCell(cellId))}>Delete</button>
    </div>
  );
};

export default ActionBar;
