import { Middleware } from "@reduxjs/toolkit";
import { cellsActions, saveCells } from "../slices/cellsSlice.ts";
import { AppDispatch } from "../store.ts";

export const saveCellsMiddleware: Middleware = ({
  dispatch,
}: {
  dispatch: AppDispatch;
}) => {
  let timer: string | number | NodeJS.Timeout | undefined;

  return (next) => (action) => {
    next(action);

    if (
      cellsActions.moveCell.match(action) ||
      cellsActions.updateCell.match(action) ||
      cellsActions.insertCellAfter.match(action) ||
      cellsActions.deleteCell.match(action)
    ) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        dispatch(saveCells());
      }, 250);
    }
  };
};
