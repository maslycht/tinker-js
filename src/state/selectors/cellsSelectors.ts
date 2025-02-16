import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectCells = (state: RootState) => state.cells;

export const selectOrderedCells = createSelector([selectCells], (cells) =>
  cells.order.map((id) => cells.data[id]),
);

export const selectCumulativeCode = createSelector(
  [selectOrderedCells, (_: RootState, cellId: string) => cellId],
  (orderedCells, cellId) => {
    const showFunc = `
        import _React from "react";
        import { createRoot as _createRoot } from "react-dom/client";
        
        var show = (value) => {
          const rootElement = document.getElementById("root");
          
          if (typeof value === "object") {
            if (value.$$typeof && value.props) {              
              _createRoot(rootElement).render(value);
            } else {
              rootElement.innerHTML = JSON.stringify(value);
            }
          } else {
            rootElement.innerHTML = value;
          }
        }
      `;

    const showFuncNoop = "var show = () => {}";

    const cumulativeCode: string[] = [];

    for (const c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) break;
    }

    return cumulativeCode.join("\n");
  },
);
