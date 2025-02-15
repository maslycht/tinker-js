import {
  DeleteCellAction,
  InsertCellBeforeAction,
  MoveCellAction,
  MoveDirection,
  UpdateCellAction,
} from "../actions";
import { ActionType } from "../action-types";
import { CellType } from "../cell.ts";

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      cellId: id,
      content,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const moveCell = (
  id: string,
  direction: MoveDirection,
): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      cellId: id,
      direction,
    },
  };
};

export const insertCellBefore = (
  id: string,
  cellType: CellType,
): InsertCellBeforeAction => {
  return {
    type: ActionType.INSERT_CELL_BEFORE,
    payload: {
      id,
      type: cellType,
    },
  };
};
