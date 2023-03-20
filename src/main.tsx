import * as React from "react";
import merge from "ts-deepmerge";
import type { BodyProps } from "./body";
import { Body } from "./body";
import type { HeaderProps } from "./header";
import { Header } from "./header";
import type { RootProps } from "./root";
import { Root } from "./root";
import type { CSSObject } from "./types";

interface TerminalProps
  extends Omit<RootProps, "title" | "prefix">,
    Pick<HeaderProps, "onClose" | "onZoom" | "onMinimize">,
    Pick<BodyProps, "onMissing" | "commands" | "prefix"> {
  title?: string | React.ReactNode;
  headerProps?: Omit<HeaderProps, "h">;
  headerHeight?: number;
  bodyProps?: BodyProps;
  theme?: Theme;
}
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

const defaultTheme: Theme = {
  header: {
    text: {
      color: "#ffffff",
    },
    container: {
      backgroundColor: "#334155",
    },
  },
  body: {
    container: {
      backgroundColor: "#0f172a",
      color: "#f8fafc",
    },
    scrollbar: {
      thumb: {
        backgroundColor: "#6b7280",
      },
      track: {
        background: "#1e293b",
      },
    },
    scrollArea: {
      paddingLeft: 12,
      paddingRight: 12,
    },
  },
};

export const Terminal = ({
  theme = defaultTheme,
  title = "Ubuntu",
  bodyProps,
  headerProps,
  headerHeight = 24,
  onClose,
  onMinimize,
  onZoom,
  onMissing,
  commands,
  children,
  prefix,
  ...props
}: TerminalProps) => {
  const hProps = {
    styles: {
      title: theme?.header?.text,
      root: theme?.header?.container,
    },
  };

  const bProps = {
    styles: {
      root: theme?.body?.container,
    },
    scrollAreaProps: {
      styles: {
        thumb: theme?.body?.scrollbar?.thumb,
        scrollbar: theme?.body?.scrollbar?.track,
        root: theme?.body?.scrollArea,
      },
    },
  };
  const hhProps = merge(hProps, headerProps || {});
  const bbProps = merge(bProps, bodyProps || {});

  return (
    <Root {...props}>
      <Header
        {...hhProps}
        onZoom={onZoom}
        onMinimize={onMinimize}
        onClose={onClose}
        h={headerHeight}
      >
        {title}
      </Header>
      <Body
        topOffset={headerHeight}
        onMissing={onMissing}
        commands={commands}
        prefix={prefix}
        {...bbProps}
      >
        {children}
      </Body>
    </Root>
  );
};
