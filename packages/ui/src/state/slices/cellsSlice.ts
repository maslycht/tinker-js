import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cell, CellType } from "../cell";
import axios from "axios";
import { RootState } from "../store.ts";

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
      const { cellId, content } = action.payload;
      state.data[cellId].content = content;
    },

    deleteCell: (state, action: PayloadAction<string>) => {
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

    insertCellAfter: (
      state,
      action: PayloadAction<{ id: string | null; type: CellType }>,
    ) => {
      const newCell: Cell = {
        id: generateId(),
        type: action.payload.type,
        content: "",
      };

      state.data[newCell.id] = newCell;

      const previousCellIndex = state.order.findIndex(
        (id) => id === action.payload.id,
      );

      if (previousCellIndex < 0) {
        state.order.unshift(newCell.id);
      } else {
        state.order.splice(previousCellIndex + 1, 0, newCell.id);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCells.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCells.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.map((cell) => cell.id); // Populate with data from action.payload
        state.data = action.payload.reduce(
          (acc, cell) => {
            acc[cell.id] = cell;
            return acc;
          },
          {} as CellsState["data"],
        );
      })
      .addCase(fetchCells.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cells";
      })
      .addCase(saveCells.rejected, (state, action) => {
        state.error = action.error.message || "Failed to save cells";
      });
  },
});

export const fetchCells = createAsyncThunk<Cell[], void>(
  "cells/fetchCells",
  async () => {
    const { data } = await axios.get("/cells");
    return data;
  },
);

export const saveCells = createAsyncThunk(
  "cells/saveCells",
  async (_, { getState }) => {
    const { data, order } = (getState() as RootState).cells;

    const cells = order.map((id) => data[id]);

    await axios.post("/cells", { cells });
  },
);

export const cellsActions = cellsSlice.actions;
export const { updateCell, deleteCell, moveCell, insertCellAfter } =
  cellsSlice.actions;

export default cellsSlice.reducer;
