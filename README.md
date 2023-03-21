## Terminal Component `⬛ Termical`

This is not an advanced terminal, it's just a simple terminal component that can be used in any React app, for more advanced terminal, check out [xterm.js](https://github.com/xtermjs/xterm.js)

- ✅ Typescript
- ✅ Fully customizable
- ✅ Persisted history
- ⚙️ Auto complete
- 🎨 Themable
- 😞 ReactJS only

## Install

```sh
npm install termical
```

```sh
pnpm add termical
```

```sh
yarn add termical
```

## Glossary

- _Line_ - A line in the terminal.
- _Stack_ - An executed command history stack.

## Usage

```ts
import { Terminal } from "termical";

const Demo = () => {
  return (
    <div style={{ height: 400 }}>
      <Terminal {...props} />
    </div>
  );
};

// OR
import { Root, Header, Body } from "termical";

const Demo = () => {
  const HEADER_HEIGHT = 24;
  return (
    <div style={{ height: 400 }}>
      <Root {...rootProps}>
        <Header {...headerProps} h={HEADER_HEIGHT} />
        <Body {...bodyProps} topOffset={HEADER_HEIGHT} />
      </Root>
    </div>
  );
};
```

### Add Commands

```ts
import { Terminal } from "termical";

const Demo = () => {
  const commands = [
    {
      text: "hello",
      description: "Say Hello!!",
      action({ value, ctx }) {
        ctx.line.add({
          content: `Hey 👋👋👋`,
          id: Math.random().toString(),
          timestamp: new Date(),
        });
      },
    },
  ];
  return <Terminal commands={commands} />;
};
```

### useTerminal

```ts
import { useTerminal } from "termical"

const Demo = () => {
  const { line, stack } = useTerminal();

  line.add(...);
  line.addMany(...);
  line.update(...);
  line.removeMany(...);
  line.reset(...);
  line.lines;

  // same for stack

  return <div>...</div>;
};
```

### Default Commands

- _help_ - Show all commands
- _history_ - Show command history
- _clear_ - Clear the terminal
- _clear history_ - Clear command history
- **Note**: You can override a default command by adding a command with the same `text` property

### Theming

```ts
import { Terminal } from "termical";

const Demo = () => {
  const theme = {
    header: {
      text: {
        color: "#facc15",
      },
      container: {
        backgroundColor: "#14532d",
      },
    },
    body: {
      container: {
        backgroundColor: "#15803d",
        color: "#fde047",
      },
      scrollbar: {
        thumb: {
          backgroundColor: "#ca8a04",
        },
        track: {
          background: "#15803d",
        },
      },
      scrollArea: {
        paddingLeft: 12,
        paddingRight: 12,
      },
    },
  };
  return <Terminal theme={theme} />;
};
```

## Props

### Terminal

| Name         | Default           | Description                           | Type                                        |
| ------------ | ----------------- | ------------------------------------- | ------------------------------------------- |
| theme        | defaultTheme      | Theme object                          | Theme                                       |
| title        | Ubuntu            | Terminal title                        | string or ReactNode                         |
| headerHeight | 24                | Header height                         | number                                      |
| onClose      |                   | Callback when close button clicked    | (e) => void                                 |
| onMinimize   |                   | Callback when minimize button clicked | (e) => void                                 |
| onZoom       |                   | Callback when zoom button clicked     | (e) => void                                 |
| prefix       | > guest@ubuntu:~$ | Input prefix                          | string or ReactNode                         |
| onMissing    |                   | Callback when command not found       | (args: ActionArgs) => void or Promise<void> |
| commands     |                   | List of commands                      | Command[]                                   |
| children     |                   | Intro message                         | ReactNode                                   |

### Root

| Name        | Description  | Type        |
| ----------- | ------------ | ----------- |
| styles      | Root Styles  | RootStyles  |
| bodyProps   | Body Props   | BodyProps   |
| headerProps | Header Props | HeaderProps |

### Header

| Name       | Description                           | Type                |
| ---------- | ------------------------------------- | ------------------- |
| styles     | Header Styles                         | HeaderStyles        |
| onClose    | Callback when close button clicked    | (e) => void         |
| onMinimize | Callback when minimize button clicked | (e) => void         |
| onZoom     | Callback when zoom button clicked     | (e) => void         |
| h          | Header height                         | number              |
| children   | Terminal title                        | string or ReactNode |

### Body

| Name      | Description                     | Type                                        |
| --------- | ------------------------------- | ------------------------------------------- |
| styles    | Body Styles                     | BodyStyles                                  |
| commands  | List of commands                | Command[]                                   |
| prefix    | Input prefix                    | string or ReactNode                         |
| onMissing | Callback when command not found | (args: ActionArgs) => void or Promise<void> |
| topOffset | Top offset                      | number                                      |
| children  | Intro message                   | ReactNode                                   |

## Interface

```ts
type Theme = {
  header?: {
    text?: CSSObject;
    container?: CSSObject;
  };
  body?: {
    container?: CSSObject;
    scrollbar?: {
      thumb?: CSSObject;
      track?: CSSObject;
    };
    scrollArea?: CSSObject;
  };
};

type Line = {
  id: string;
  content: string | React.ReactNode;
  timestamp: Date;
};
type Stack = {
  text: string;
  timestamp: Date;
};
type Command = {
  text: string;
  action: (args: ActionArgs) => void | Promise<void>;
  exact?: boolean;
  description?: string;
};

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
```

### Styles API Interface

```ts
type RootStyles = {
  container?: CSSObject;
};
type HeaderStyles = {
  root?: CSSObject;
  title?: CSSObject;
  close?: CSSObject;
  minimize?: CSSObject;
  zoom?: CSSObject;
};

type BodyStyles = {
  container?: CSSObject;
  scrollArea?: CSSObject;
  input?: CSSObject;
  node?: CSSObject;
};
```

## Examples

### Fullscreen terminal

```ts
const Demo = () => {
  // without container height, the terminal will be fullscreen
  return <Terminal />;
};

// OR
const Demo = () => {
  const HEADER_HEIGHT = 24;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      }}
    >
      <Root>
        <Header h={HEADER_HEIGHT} />
        <Body topOffset={HEADER_HEIGHT} />
      </Root>
    </div>
  );
};
```

### Add intro message

```ts
const Demo = () => {
  return (
    <Terminal>
      <p>Hello 👋!!</p>
    </Terminal>
  );
};

// OR
const Demo = () => {
  const HEADER_HEIGHT = 24;
  return (
    <Root>
      <Header h={HEADER_HEIGHT} />
      <Body topOffset={HEADER_HEIGHT}>
        <p>Hello 👋!!</p>
      </Body>
    </Root>
  );
};
```

### Clearable intro message

Note: the intro message will get added twice in development mode if you're on react@18.x.x

```ts
const { line } = useTerminal();

useEffect(() => {
  let intro = line.lines.find((line) => line.id === "intro");

  if (!intro) {
    line.add({
      id: "intro",
      content: (
        <div>
          <p>
            😌 It will be nice to execute your commands here. <br />
            <br />
            Type <em>help</em> to see available commands.
          </p>
        </div>
      ),
      timestamp: new Date(),
    });
  }
}, []);

// 😌 It will be nice to execute your commands here.
//
//
// Type _help_ to see available commands.
// > :~$
```

### The power of `line.update()`

In this example we used `line.update()` from `useTerminal` to create a a hook that will update a line every `delay` milliseconds.

- it will create a line with id `flashy_message` if it doesn't exist
- it will update the line with id `flashy_message` with the next number
- update will be called every `delay` milliseconds

```ts
import { useTerminal } from "termical";

const useFlashyMessage = (delay: number | null) => {
  const id = "flashy_message";

  const { line } = useTerminal();

  // https://usehooks-ts.com/react-hook/use-interval
  useInterval(() => {
    let inLine = line.lines.find((line) => line.id === id)?.content;
    if (!inLine) {
      line.add({
        id,
        content: " ",
        timestamp: new Date(),
      });

      inLine = line.lines.find((line) => line.id === id)?.content;
    }
    const message = (Number(inLine) + 1).toString();

    line.update(id, {
      content: isNaN(Number(message)) ? "0" : message,
    });
  }, delay);
};

// Usage
const Demo = () => {
  const [delay, setDelay] = useState(null);
  // we set `delay` to null to stop the interval until we
  // decide to start it

  useFlashyMessage(delay);

  return (
    <>
      <Terminal>
        <p>Hello 👋!!</p>
      </Terminal>
      <button onClick={() => setDelay(1000)}>Start</button>
      <button onClick={() => setDelay(null)}>Stop</button>
    </>
  );
};
```

### command with `--options`

To handle commands with options, we can use `exact: false` and parse the value.

```ts
const commands = [
  ...,
  {
    text: "hello",
    description: "Say Hello!!",
    exact: false,
    action({ value, ctx }) {
      const _value = value.replace("hello ", "✨")

      ctx.line.add({
        content: `Hey ${_value}✨!`,
        id: Math.random().toString(),
        timestamp: new Date(),
      });
    },
  }
  ...,
]

// :~$ hello world
// Hey ✨world✨!
```

### Executing another command

```ts
const commands = [
  {
    text: "hey",
    description: "Mirror 'hello' command",
    action(args) {
      args.ctx.commands
        .find((command) => command.text === "hello")
        ?.action(args);
    },
  },
];
```

### Use as a log viewer

We will create a custom hook to make life easier.

```ts
const useLog = () => {
  const { line } = useTerminal();

  return {
    log: (content: string | React.ReactNode) => {
      line.add({
        id: Math.random().toString(),
        content,
        timestamp: new Date(),
      });
    },
    Terminal: () => (
      <Root>
        <Body topOffset={0} prefix="" />
      </Root>
    ),
  };
};

const Demo = () => {
  const { log, Terminal } = useLog();
  log("Hello World!");

  return (
    <div>
      <Terminal />

      <button onClick={() => log("👋👋 Hello World!")}>Say Hello</button>
    </div>
  );
};

// result
// Hello World!
// 👋👋 Hello World! <--- after clicking the button
// 👋👋 Hello World! <--- after clicking the button again
```

### No persistent history

```ts
const { line, stack } = useTerminal();

useEffect(() => {
  line.reset();

  // also reset the history
  // stack.reset();
}, []);
```
