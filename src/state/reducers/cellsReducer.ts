import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell.ts";
import { produce } from "immer";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.UPDATE_CELL: {
        const { cellId, content } = action.payload;
        state.data[cellId].content = content;

        return state;
      }
      case ActionType.DELETE_CELL: {
        const cellId = action.payload;
        delete state.data[cellId];
        state.order = state.order.filter((id) => id !== cellId);

        return state;
      }
      case ActionType.MOVE_CELL: {
        const { cellId, direction } = action.payload;
        const index = state.order.findIndex((id) => id === cellId);
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }

        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = cellId;

        return state;
      }
      case ActionType.INSERT_CELL_BEFORE: {
        const newCell: Cell = {
          id: randomId(),
          type: action.payload.type,
          content: "",
        };

        state.data[newCell.id] = newCell;

        const insertIndex = state.order.findIndex(
          (id) => id === action.payload.id,
        );

        if (insertIndex < 0) {
          state.order.push(newCell.id);
        } else {
          state.order.splice(insertIndex, 0, newCell.id);
        }

        return state;
      }
      default:
        return state;
    }
  },
  initialState,
);

const randomId = () => {
  return Math.random().toString(36).substring(2, 7);
};

export default reducer;
