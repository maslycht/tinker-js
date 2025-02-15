import "./add-cell.css";
import { FC } from "react";
import { insertCellAfter } from "../state";
import { useAppDispatch } from "../hooks/useAppDispatch.ts";

interface AddCellProps {
  forceVisible?: boolean;
  previousCellId: string | null;
}

const AddCell: FC<AddCellProps> = ({
  forceVisible = false,
  previousCellId,
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className={`add-cell ${forceVisible && "force-visible"}`}>
      <div className={"add-buttons"}>
        <button
          className={"button is-rounded is-primary is-small"}
          onClick={() =>
            dispatch(insertCellAfter({ id: previousCellId, type: "code" }))
          }
        >
          <span className={"icon is-small"}>
            <i className={"fas fa-plus"} />
          </span>
          <span>Code</span>
        </button>
        <button
          className={"button is-rounded is-primary is-small"}
          onClick={() =>
            dispatch(insertCellAfter({ id: previousCellId, type: "text" }))
          }
        >
          <span className={"icon is-small"}>
            <i className={"fas fa-plus"} />
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className={"divider"} />
    </div>
  );
};

export default AddCell;
