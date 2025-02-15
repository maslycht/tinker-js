import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cell, CellType } from "../cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: { [key: string]: Cell };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

function generateId() {
  return Math.random().toString(36).substring(2, 7);
}

const cellsSlice = createSlice({
  name: "cells",
  initialState,
  reducers: {
    updateCell: (
      state,
      action: PayloadAction<{ cellId: string; content: string }>,
    ) => {
      state.data[action.payload.cellId].content = action.payload.content;
    },
    deleteCell: (state, action: PayloadAction<string>) => {
      console.log("DELETE ACTION DISPATCHED");
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);
    },
    moveCell: (
      state,
      action: PayloadAction<{ cellId: string; direction: "up" | "down" }>,
    ) => {
      const { cellId, direction } = action.payload;
      const index = state.order.findIndex((id) => id === cellId);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= state.order.length) return;

      [state.order[index], state.order[targetIndex]] = [
        state.order[targetIndex],
        state.order[index],
      ];
    },
    insertCellBefore: (
      state,
      action: PayloadAction<{ id: string | null; type: CellType }>,
    ) => {
      const newCell: Cell = {
        id: generateId(),
        type: action.payload.type,
        content: "",
      };
      state.data[newCell.id] = newCell;
      const index = state.order.findIndex((id) => id === action.payload.id);
      if (index < 0) state.order.push(newCell.id);
      else state.order.splice(index, 0, newCell.id);
    },
  },
});

export const { updateCell, deleteCell, moveCell, insertCellBefore } =
  cellsSlice.actions;
export default cellsSlice.reducer;
