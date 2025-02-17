const prefix = "[TinkerJS]";

export const log = (...args: any[]) => {
  console.log(prefix, ...args);
};

export const err = (...args: any[]) => {
  console.error(prefix, ...args);
};
