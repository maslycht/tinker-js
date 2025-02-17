import { configureStore } from "@reduxjs/toolkit";
import cellsReducer from "./slices/cellsSlice";
import bundlesReducer from "./slices/bundlesSlice";
import { saveCellsMiddleware } from "./middlewares/saveCellsMiddleware.ts";

export const store = configureStore({
  reducer: {
    cells: cellsReducer,
    bundles: bundlesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(saveCellsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
