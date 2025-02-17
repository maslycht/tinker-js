import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import bundle from "../../bundler";

interface BundlesState {
  [key: string]:
    | {
        loading: boolean;
        code: string;
        error: string;
      }
    | undefined;
}

const initialState: BundlesState = {};

const bundlesSlice = createSlice({
  name: "bundles",
  initialState,
  reducers: {
    bundleStart: (state, action: PayloadAction<string>) => {
      state[action.payload] = {
        loading: true,
        code: "",
        error: "",
      };
    },

    bundleComplete: (
      state,
      action: PayloadAction<{
        cellId: string;
        bundle: {
          bundledCode: string;
          error: string;
        };
      }>,
    ) => {
      state[action.payload.cellId] = {
        loading: false,
        code: action.payload.bundle.bundledCode,
        error: action.payload.bundle.error,
      };
    },
  },
});

export const bundleCode = createAsyncThunk<
  void,
  { cellId: string; rawCode: string }
>("bundles/bundleCode", async ({ cellId, rawCode }, { dispatch }) => {
  dispatch(bundlesActions.bundleStart(cellId));

  const result = await bundle(rawCode);

  dispatch(
    bundlesActions.bundleComplete({
      cellId,
      bundle: result,
    }),
  );
});

const bundlesActions = bundlesSlice.actions;

export default bundlesSlice.reducer;
