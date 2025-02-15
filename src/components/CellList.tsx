import { FC } from "react";
import { useTypedSelector } from "../hooks/useTypedSelector.ts";
import CellListItem from "./CellListItem.tsx";
import { selectOrderedCells } from "../state/selectors/cellsSelectors.ts";

const CellList: FC = () => {
  const cells = useTypedSelector(selectOrderedCells);

  const renderedCells = cells.map((cell, index) => (
    <CellListItem key={`${cell.id}-${index}`} cell={cell} />
  ));

  return <div>{renderedCells}</div>;
};

export default CellList;
