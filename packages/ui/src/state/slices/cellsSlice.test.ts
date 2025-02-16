import { describe, it, expect } from "vitest";
import { Cell, CellType } from "../cell.ts";
import cellsReducer, {
  deleteCell,
  insertCellAfter,
  moveCell,
  updateCell,
} from "./cellsSlice.ts";

// Helper function to create a test cell
const createTestCell = (id: string, type: CellType, content: string): Cell => ({
  id,
  type,
  content,
});

describe("cellsReducer", () => {
  it("should return initial state when no action is provided", () => {
    const initialState = cellsReducer(undefined, {} as never);
    expect(initialState).toEqual({
      loading: false,
      error: null,
      order: [],
      data: {},
    });
  });

  it("should update a cell's content", () => {
    const initialState = {
      loading: false,
      error: null,
      order: ["1"],
      data: { "1": createTestCell("1", "code", "Initial content") },
    };

    const action = updateCell({ cellId: "1", content: "Updated content" });

    const newState = cellsReducer(initialState, action);

    expect(newState.data["1"].content).toBe("Updated content");
  });

  it("should delete a cell", () => {
    const initialState = {
      loading: false,
      error: null,
      order: ["1", "2"],
      data: {
        "1": createTestCell("1", "code", ""),
        "2": createTestCell("2", "text", ""),
      },
    };

    const action = deleteCell("1");

    const newState = cellsReducer(initialState, action);

    expect(Object.keys(newState.data).length).toBe(1);
    expect(newState.data).not.toHaveProperty("1");
    expect(newState.order.length).toBe(1);
    expect(newState.order).not.toContain("1");
  });

  it("should move a cell up", () => {
    const initialState = {
      loading: false,
      error: null,
      order: ["1", "2", "3"],
      data: {
        "1": createTestCell("1", "code", ""),
        "2": createTestCell("2", "text", ""),
        "3": createTestCell("3", "code", ""),
      },
    };

    const action = moveCell({ cellId: "2", direction: "up" });

    const newState = cellsReducer(initialState, action);

    expect(newState.order).toEqual(["2", "1", "3"]);
  });

  it("should move a cell down", () => {
    const initialState = {
      loading: false,
      error: null,
      order: ["1", "2", "3"],
      data: {
        "1": createTestCell("1", "code", ""),
        "2": createTestCell("2", "text", ""),
        "3": createTestCell("3", "code", ""),
      },
    };

    const action = moveCell({ cellId: "2", direction: "down" });

    const newState = cellsReducer(initialState, action);

    expect(newState.order).toEqual(["1", "3", "2"]);
  });

  it("should not move first cell up", () => {
    const initialState = {
      loading: false,
      error: null,
      order: ["1", "2", "3"],
      data: {
        "1": createTestCell("1", "code", ""),
        "2": createTestCell("2", "text", ""),
        "3": createTestCell("3", "code", ""),
      },
    };

    const action = moveCell({ cellId: "1", direction: "up" });

    const newState = cellsReducer(initialState, action);

    expect(newState).toEqual(initialState);
  });

  it("should not move last cell down", () => {
    const initialState = {
      loading: false,
      error: null,
      order: ["1", "2", "3"],
      data: {
        "1": createTestCell("1", "code", ""),
        "2": createTestCell("2", "text", ""),
        "3": createTestCell("3", "code", ""),
      },
    };

    const action = moveCell({ cellId: "3", direction: "down" });

    const newState = cellsReducer(initialState, action);

    expect(newState).toEqual(initialState);
  });

  it("should insert a new cell if no cells exist", () => {
    const initialState = {
      loading: false,
      error: null,
      order: [],
      data: {},
    };

    const action = insertCellAfter({ id: null, type: "code" });

    const newState = cellsReducer(initialState, action);

    expect(newState.order.length).toBe(1);
    expect(newState.data[newState.order[0]].type).toBe("code");
  });

  it("should insert a new cell after an existing cell", () => {
    const initialState = {
      loading: false,
      error: null,
      order: ["1", "2"],
      data: {
        "1": createTestCell("1", "text", ""),
        "2": createTestCell("2", "text", ""),
      },
    };

    const action = insertCellAfter({ id: "2", type: "code" });

    const newState = cellsReducer(initialState, action);

    expect(newState.order.length).toBe(3);
    expect(newState.data[newState.order[2]].type).toBe("code");
    expect(newState.order[2]).not.toBeOneOf(["1", "2"]);
  });

  it("should insert a new cell at the top if cell id is null", () => {
    const initialState = {
      loading: false,
      error: null,
      order: ["1", "2"],
      data: {
        "1": createTestCell("1", "text", ""),
        "2": createTestCell("2", "text", ""),
      },
    };

    const action = insertCellAfter({ id: null, type: "code" });

    const newState = cellsReducer(initialState, action);

    expect(newState.order.length).toBe(3);
    expect(newState.data[newState.order[0]].type).toBe("code");
    expect(newState.order[0]).not.toBeOneOf(["1", "2"]);
  });
});
