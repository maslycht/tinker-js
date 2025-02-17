import "./cell-list.css";
import { Fragment, useEffect } from "react";
import { useTypedSelector } from "../hooks/useTypedSelector.ts";
import CellListItem from "./CellListItem.tsx";
import { selectOrderedCells } from "../state/selectors/cellsSelectors.ts";
import AddCell from "./AddCell.tsx";
import { useAppDispatch } from "../hooks/useAppDispatch.ts";
import { fetchCells } from "../state";

const CellList = () => {
  const dispatch = useAppDispatch();
  const cells = useTypedSelector(selectOrderedCells);

  // fetch cells once on load
  useEffect(
    () => {
      dispatch(fetchCells());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
