import { FC } from "react";
import { useAppDispatch } from "../state";
import { cellsActions } from "../state";

interface ActionButtonProps {
  type: "moveUp" | "moveDown" | "delete";
  action: ReturnType<(typeof cellsActions)[keyof typeof cellsActions]>;
}

const ActionButton: FC<ActionButtonProps> = ({ type, action }) => {
  const dispatch = useAppDispatch();
  let icon = "";

  switch (type) {
    case "moveUp":
      icon = "fa-circle-up";
      break;
    case "moveDown":
      icon = "fa-circle-down";
      break;
    case "delete":
      icon = "fa-trash-can";
      break;
  }

  return (
    <button
      className={"button is-primary is-small"}
      onClick={() => dispatch(action)}
    >
      <span className={"icon"}>
        <i className={"fas " + icon} />
      </span>
    </button>
  );
};

export default ActionButton;
