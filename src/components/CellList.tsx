import "./cell-list.css";
import { Fragment } from "react";
import { useTypedSelector } from "../hooks/useTypedSelector.ts";
import CellListItem from "./CellListItem.tsx";
import { selectOrderedCells } from "../state/selectors/cellsSelectors.ts";
import AddCell from "./AddCell.tsx";

const CellList = () => {
  const cells = useTypedSelector(selectOrderedCells);

  const renderedCells = cells.map((cell, index) => {
    return (
      <Fragment key={`${cell.id}-${index}`}>
        <CellListItem cell={cell} />
        <AddCell previousCellId={cell.id} />
      </Fragment>
    );
  });

  return (
    <div className={"cell-list"}>
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
