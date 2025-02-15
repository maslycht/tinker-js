import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store"; // adjust path accordingly

export const selectCells = (state: RootState) => state.cells;

export const selectOrderedCells = createSelector([selectCells], (cells) =>
  cells.order.map((id) => cells.data[id]),
);
