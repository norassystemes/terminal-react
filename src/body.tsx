import * as React from "react";
import type { ScrollAreaProps } from "./scroll";
import { ScrollArea } from "./scroll";
import type { DefaultProps } from "./types";
import type { Line, LinesState, Stack, StacksState } from "./utils";
import {
  isPromise,
  useDefaultStyles,
  useHasHydrated,
  useLines,
  useStacks,
} from "./utils";
import TextareaAutosize from "react-textarea-autosize";
type Names = "root" | "scrollArea" | "input" | "node";

type Context = {
  commands: Command[];
  lines: Line[];
  stacks: Stack[];
  line: LinesState;
  stack: StacksState;
};
type ActionArgs = {
  value: string;
  event: React.KeyboardEvent<HTMLTextAreaElement>;
  ctx: Context;
};
type ActionReturn = void;
type Action = (args: ActionArgs) => ActionReturn | Promise<ActionReturn>;

type Command = {
  text: string;
  action: Action;
  exact?: boolean;
  description?: string;
};

export interface BodyProps
  extends DefaultProps<Names>,
    Omit<React.ComponentPropsWithoutRef<"div">, "prefix"> {
  topOffset: number;
  commands?: Command[];
  onMissing?: Action;
  prefix?: string | React.ReactNode;
  scrollAreaProps?: ScrollAreaProps;
}

const defaultStyles = {
  root: {},
  scrollArea: {},
  input: {},
  node: {},
};
const defaultCommands: Command[] = [
  {
    text: "help",
    description: "List all available commands",
    action({ ctx }) {
      console.log(ctx);
      const toAdd = (
        <div className="flex flex-col justify-start items-start">
          {ctx.commands?.map((c) => (
            <div key={c.text} className="flex flex-col">
              <p>{c.text}</p>
              <p>- {c.description}</p>
            </div>
          ))}
        </div>
      );

      ctx.line.add({
        id: Math.random().toString(),
        content: toAdd,
        timestamp: new Date(),
      });
    },
  },
  {
    text: "clear",
    description: "Clear the terminal",
    action({ ctx }) {
      ctx.line.reset();
    },
  },
  {
    text: "clear history",
    description: "Clear the terminal",
    action({ ctx }) {
      ctx.stack.reset();
    },
  },
  {
    text: "history",
    description: "List all commands that have been run",
    action({ ctx }) {
      const stacks = ctx.stack.stacks;

      const toAdd = (
        <div className="flex flex-col justify-start items-start">
          {stacks?.map((s) => (
            <div key={Math.random()} className="flex gap-8">
              <p>{new Date(s.timestamp || 0).toISOString()}</p>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      );

      ctx.line.add({
        id: Math.random().toString(),
        content: toAdd,
        timestamp: new Date(),
      });
    },
  },
];

export const Body = React.forwardRef<HTMLDivElement, BodyProps>(
  (props, ref) => {
    const {
      styles = {},
      children,
      topOffset,
      commands: _commands = [],
      onMissing,
      prefix = "> guest@ubuntu:~$",
      scrollAreaProps,
      ...rest
    } = props;

    const commands = React.useMemo(() => {
      return [...defaultCommands, ..._commands];
    }, [_commands]);

    const _styles = useDefaultStyles("Body", defaultStyles, styles);

    const [value, setValue] = React.useState("");
    const [committed, setCommitted] = React.useState<Date | null>(null);
    const [currentStackIndex, setCurrentStackIndex] = React.useState(0);

    const viewport = React.useRef<HTMLDivElement>(null);
    function scrollToBottom() {
      if (viewport.current) {
        viewport.current.scrollTo({
          top: viewport.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }

    React.useEffect(() => {
      setTimeout(() => {
        scrollToBottom();
      }, 10);
    }, []);
    React.useEffect(() => {
      if (committed) scrollToBottom();
    }, [committed]);

    let lineRef = React.useRef(useLines.getState().lines);
    let stackRef = React.useRef(useStacks.getState().stacks);
    React.useEffect(() => {
      useLines.subscribe((state) => (lineRef.current = state.lines));
      useStacks.subscribe((state) => (stackRef.current = state.stacks));
    }, []);

    const ctx: ActionArgs["ctx"] = {
      commands,
      lines: lineRef.current,
      stacks: stackRef.current,
      line: useLines.getState(),
      stack: useStacks.getState(),
    };
    async function onEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      const _command = commands?.find((c) =>
        e.currentTarget.value.startsWith(c.text)
      );
      const command = !_command?.exact
        ? _command
        : _command.text === e.currentTarget.value
        ? _command
        : undefined;

      useLines.getState().add({
        id: Math.random().toString(),
        timestamp: new Date(),
        content:
          typeof prefix === "string" ? (
            prefix + " " + e.currentTarget.value
          ) : (
            <div className="flex">
              {prefix} {e.currentTarget.value}
            </div>
          ),
      });
      useStacks.getState().add({
        text: e.currentTarget.value,
        timestamp: new Date(),
      });

      if (command) {
        if (isPromise(command.action)) {
          await command.action({
            value: e.currentTarget.value,
            event: e,
            ctx,
          });
        } else {
          command.action({
            value: e.currentTarget.value,
            event: e,
            ctx,
          });
        }
      } else {
        if (onMissing && isPromise(onMissing)) {
          await onMissing({ value: e.currentTarget.value, event: e, ctx });
        } else {
          if (!onMissing) {
            useLines.getState().add({
              id: Math.random().toString(),
              content: e.currentTarget.value + ": command not found",
              timestamp: new Date(),
            });
          } else {
            onMissing({ value: e.currentTarget.value, event: e, ctx });
          }
        }
      }

      setValue("");
      setCommitted(new Date());
      return;
    }
    function onTab() {
      if (!value) return;
      const autocompleted = autocomplete(value);
      if (!autocompleted) return;

      setValue(value + autocompleted);
      return;
    }
    function onArrowUp() {
      const firstTime = value === "";
      if (firstTime) {
        const index = useStacks.getState().stacks.length - 1;
        const latest = useStacks.getState().stacks[index];
        if (latest) {
          setValue(latest.text);
          setCurrentStackIndex(index);
        }
        return;
      }

      const prev = useStacks.getState().stacks[currentStackIndex - 1];
      if (prev) {
        setValue(prev.text);
        setCurrentStackIndex(currentStackIndex - 1);
      }
    }
    function onArrowDown() {
      const firstTime = value === "";
      if (firstTime) {
        return;
      }

      const next = useStacks.getState().stacks[currentStackIndex + 1];
      if (next) {
        setValue(next.text);
        setCurrentStackIndex(currentStackIndex + 1);
      }
    }
    function onEsc() {
      setValue("");
    }
    async function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      switch (e.key) {
        case "Enter":
          e.preventDefault();
          await onEnter(e);
          break;
        case "Tab":
          e.preventDefault();
          onTab();
          break;
        case "ArrowUp":
          e.preventDefault();
          onArrowUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          onArrowDown();
          break;

        case "Escape":
          e.preventDefault();
          onEsc();
          break;
      }
    }

    const inputRef = React.useRef<HTMLTextAreaElement>(null);

    function focusInput() {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }

    const ready = useHasHydrated();

    const cmd = React.useMemo(() => {
      return commands?.map((cmd) => cmd.text) ?? [];
    }, [commands]);

    const [texts] = React.useState<string[]>(cmd);
    const autocomplete = React.useCallback(
      (text: string): string => {
        if (text === "") {
          return "";
        }

        const filtered = [...texts].filter((cmd) => cmd.startsWith(text));
        if (text === filtered[0]) {
          return "";
        }

        return filtered.length > 0
          ? filtered?.[0]?.slice(text.length) || ""
          : "";
      },
      [texts]
    );

    return (
      <div
        onClick={focusInput}
        className={`cursor-text w-full font-mono text-white`}
        style={{
          ..._styles.root,
          height: `calc(100% - ${topOffset}px)`,
        }}
        ref={ref}
        {...rest}
      >
        <ScrollArea viewportRef={viewport} {...scrollAreaProps}>
          <div
            className="flex flex-col items-start w-full h-full"
            style={_styles.scrollArea}
          >
            {children}
            {(ready ? lineRef.current : [])?.map((node, i) => (
              <Node key={i} style={_styles.node}>
                {React.isValidElement(node.content) ? (
                  node.content
                ) : typeof node.content === "string" ? (
                  <span>{node.content}</span>
                ) : (
                  <span></span>
                )}
              </Node>
            ))}
            <div className="pb-8 inline-flex w-full relative">
              {typeof prefix === "string" ? (
                <div className="pr-2 flex-none">{prefix}</div>
              ) : (
                prefix
              )}
              <div className="flex shrink w-full relative flex-auto">
                <TextareaAutosize
                  ref={inputRef}
                  // maxRows={5}
                  cacheMeasurements
                  value={value}
                  onChange={(e) => {
                    if (e.currentTarget.value.length > 100) return;
                    setValue(e.currentTarget.value);
                  }}
                  className="textarea absolute w-full resize-none bg-black bg-opacity-0 border-0 focus:ring-0 focus:outline-none"
                  style={{
                    ..._styles.input,
                    fontFamily: "inherit",
                  }}
                  onKeyDown={onKeyDown}
                />
                <div className="absolute flex w-full opacity-50 select-none">
                  <p>{value + autocomplete(value)} </p>
                  {autocomplete(value) && (
                    <div className="pl-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-2 h-2"
                        viewBox="0 0 512 512"
                      >
                        <title>Arrow Undo</title>
                        <path
                          fill="currentColor"
                          d="M464 440l-28.12-32.11c-22.48-25.65-43.33-45.45-72.08-58.7-26.61-12.26-60-18.65-104.27-19.84V432L48 252 259.53 72v103.21c72.88 3 127.18 27.08 161.56 71.75C449.56 284 464 335.19 464 399.26z"
                        />
                      </svg>
                      <p className="text-xs">Tab</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }
);

Body.displayName = "Body";

interface NodeProps extends React.ComponentPropsWithoutRef<"div"> {}
export const Node = React.forwardRef<HTMLDivElement, NodeProps>(
  (props, ref) => {
    return <div ref={ref} className="" {...props}></div>;
  }
);

Node.displayName = "Node";
