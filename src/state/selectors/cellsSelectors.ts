import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectCells = (state: RootState) => state.cells;

export const selectOrderedCells = createSelector([selectCells], (cells) =>
  cells.order.map((id) => cells.data[id]),
);

export const selectCumulativeCode = createSelector(
  [selectOrderedCells, (_: RootState, cellId: string) => cellId],
  (orderedCells, cellId) => {
    const cumulativeCode: string[] = [];
    for (const c of orderedCells) {
      if (c.type === "code") {
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) break;
    }
    return cumulativeCode;
  },
);
