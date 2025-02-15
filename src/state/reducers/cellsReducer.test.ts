import { describe, it, expect } from "vitest";
import reducer from "./cellsReducer";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell, CellType } from "../cell";

// Helper function to create a test cell
const createTestCell = (id: string, type: CellType, content: string): Cell => ({
  id,
  type,
  content,
});

describe("cellsReducer", () => {
  it("should return initial state when no action is provided", () => {
    const initialState = reducer(undefined, {} as Action);
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

    const action: Action = {
      type: ActionType.UPDATE_CELL,
      payload: { cellId: "1", content: "Updated content" },
    };

    const newState = reducer(initialState, action);

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

    const action: Action = {
      type: ActionType.DELETE_CELL,
      payload: "1",
    };

    const newState = reducer(initialState, action);

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

    const action: Action = {
      type: ActionType.MOVE_CELL,
      payload: { cellId: "2", direction: "up" },
    };

    const newState = reducer(initialState, action);

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

    const action: Action = {
      type: ActionType.MOVE_CELL,
      payload: { cellId: "2", direction: "down" },
    };

    const newState = reducer(initialState, action);

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

    const action: Action = {
      type: ActionType.MOVE_CELL,
      payload: { cellId: "1", direction: "up" },
    };

    const newState = reducer(initialState, action);

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

    const action: Action = {
      type: ActionType.MOVE_CELL,
      payload: { cellId: "3", direction: "down" },
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(initialState);
  });

  it("should insert a new cell before an existing cell", () => {
    const initialState = {
      loading: false,
      error: null,
      order: ["1", "2"],
      data: {
        "1": createTestCell("1", "text", ""),
        "2": createTestCell("2", "text", ""),
      },
    };

    const action: Action = {
      type: ActionType.INSERT_CELL_BEFORE,
      payload: { id: "2", type: "code" },
    };

    const newState = reducer(initialState, action);

    expect(newState.order.length).toBe(3);
    expect(newState.data[newState.order[1]].type).toBe("code");
    expect(newState.order[2]).toBe("2");
  });

  it("should insert a new cell if no cells exist", () => {
    const initialState = {
      loading: false,
      error: null,
      order: [],
      data: {},
    };

    const action: Action = {
      type: ActionType.INSERT_CELL_BEFORE,
      payload: { id: null, type: "code" },
    };

    const newState = reducer(initialState, action);

    expect(newState.order.length).toBe(1);
    expect(newState.data[newState.order[0]].type).toBe("code");
  });
});
