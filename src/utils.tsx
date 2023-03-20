import * as React from "react";
import { create } from "zustand";
import type { StateStorage, StorageValue } from "zustand/middleware";
import { devtools, persist } from "zustand/middleware";
import merge from "ts-deepmerge";
// import reactElementToJSXString from "react-element-to-jsx-string";
import { renderToString } from "react-dom/server";
import htmlParser from "html-react-parser";

const components = {
  Root: {
    defaultStyles: {
      container: {},
    },
  },
  Header: {
    defaultStyles: {
      root: {},
      close: {},
      minimize: {},
      zoom: {},
      title: {},
    },
  },
  Body: {
    defaultStyles: {
      root: {},
      scrollArea: {},
      node: {},
      input: {},
    },
  },
  ScrollArea: {
    defaultStyles: {
      root: {},
      viewport: {},
      scrollbar: {},
      thumb: {},
      corner: {},
    },
  },
};
type Components = typeof components;
export function useDefaultStyles<
  T extends Record<string, any>,
  V extends keyof Components,
  U extends Partial<T> = {}
>(component: V, defaultStyles: U, styles: T): Components[V]["defaultStyles"] {
  const contextStyles = components[component]?.defaultStyles;

  const merged = merge(contextStyles, defaultStyles, styles);

  return merged as Components[V]["defaultStyles"];
}

function createConverter(units: string) {
  return (px: unknown) => {
    if (typeof px === "number") {
      return `${px / 16}${units}`;
    }

    if (typeof px === "string") {
      const replaced = px.replace("px", "");
      if (!Number.isNaN(Number(replaced))) {
        return `${Number(replaced) / 16}${units}`;
      }
    }

    return px as string;
  };
}

export const rem = createConverter("rem");
export const em = createConverter("em");

export type Line = {
  id: string;
  content: string | React.ReactNode;
  timestamp: Date;
};
export interface LinesState {
  lines: Line[];
  add: (line: Line) => void;
  update: (id: string, line: Omit<Line, "id">) => void;
  addMany: (lines: Line[]) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
  reset: () => void;
}
export const useLines = create<LinesState>()(
  devtools(
    persist(
      (set) => ({
        lines: [],
        add: (line) =>
          set((state) => {
            const lines = {
              lines: Array.isArray(state.lines)
                ? [...state.lines, line]
                : [line],
            };
            return lines;
          }),
        update: (id, line) =>
          set((state) => ({
            lines: state.lines.map((ln) =>
              ln.id === id
                ? {
                    ...ln,
                    ...line,
                  }
                : ln
            ),
          })),
        addMany: (lines) =>
          set((state) => {
            const newLines = lines.map((line) => ({
              ...line,
              timestamp: line.timestamp ?? new Date(),
            }));
            const _lines = {
              lines: Array.isArray(state.lines)
                ? [...state.lines, ...newLines]
                : newLines,
            };
            return _lines;
          }),
        remove: (id) =>
          set((state) => ({
            lines: state.lines.filter((ln) => ln.id === id),
          })),
        removeMany: (ids) =>
          set((state) => ({
            lines: state.lines.filter((ln) => ids.includes(ln.id)),
          })),
        reset: () =>
          set(() => ({
            lines: [],
          })),
      }),
      {
        name: "lines",
        storage: {
          getItem: (name) => {
            const parse = (str: string | null) => {
              if (str === null) {
                return null;
              }
              return JSON.parse(str) as StorageValue<LinesState>;
            };
            const str = (localStorage as StateStorage).getItem(name) ?? null;
            if (str instanceof Promise) {
              return str.then(parse);
            }

            const parsed = parse(str);

            return {
              ...parsed,
              state: {
                lines:
                  parsed?.state.lines?.map((ln) => ({
                    ...ln,
                    content: (ln.content as string)?.startsWith("<")
                      ? htmlParser(ln.content as string)
                      : ln.content,
                  })) || [],
              },
            };
          },
          setItem: (name, newValue) => {
            const lines =
              newValue.state.lines?.map((ln) => ({
                ...ln,
                content:
                  typeof ln.content === "string"
                    ? ln.content
                    : renderToString(ln.content as React.ReactElement),
              })) || [];
            return (localStorage as StateStorage).setItem(
              name,
              JSON.stringify({
                ...newValue,
                state: {
                  ...newValue.state,
                  lines,
                },
              })
            );
          },
          removeItem: (name) => (localStorage as StateStorage).removeItem(name),
        },
      }
    )
  )
);

export type Stack = {
  text: string;
  timestamp: Date;
};
export interface StacksState {
  stacks: Stack[];
  add: (stack: Stack) => void;
  addMany: (stacks: Stack[]) => void;
  remove: (ts: string) => void;
  removeMany: (tss: string[]) => void;
  reset: () => void;
}
export const useStacks = create<StacksState>()(
  devtools(
    persist(
      (set, get) => ({
        stacks: [],
        add: (stack) =>
          set((state) => {
            const stacks = {
              stacks: Array.isArray(state.stacks)
                ? [...state.stacks, stack]
                : [stack],
            };
            return stacks;
          }),
        addMany: (stacks) =>
          set((state) => {
            const newStacks = stacks.map((stack) => ({
              ...stack,
              timestamp: stack.timestamp ?? new Date(),
            }));
            const _stacks = {
              stacks: Array.isArray(state.stacks)
                ? [...state.stacks, ...newStacks]
                : newStacks,
            };
            return _stacks;
          }),
        remove: (ts) =>
          set((state) => ({
            stacks: state.stacks.filter((cmd) => cmd.text === ts),
          })),
        removeMany: (tss) =>
          set((state) => ({
            stacks: state.stacks.filter((cmd) => tss.includes(cmd.text)),
          })),
        reset: () =>
          set(() => ({
            stacks: [],
          })),
      }),
      {
        name: "stacks",
      }
    )
  )
);

export const useTerminal = () => {
  const stacks = useStacks();
  const lines = useLines();

  return {
    stack: stacks,
    line: lines,
  };
};

export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = React.useState<boolean>(false);

  React.useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

export function isPromise(obj: any) {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
}
