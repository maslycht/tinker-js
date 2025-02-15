import { configureStore } from "@reduxjs/toolkit";
import cellsReducer, { insertCellBefore } from "./slices/cellsSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    cells: cellsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

