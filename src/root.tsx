import * as React from "react";
import type { DefaultProps } from "./types";
import { useDefaultStyles } from "./utils";

type Names = "container";

export interface RootProps
  extends DefaultProps<Names>,
    React.ComponentPropsWithoutRef<"div"> {}

const defaultStyles = {
  container: {
    height: "100%",
  },
};
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (props, ref) => {
    const { children, styles = {}, ...rest } = props;
    const _styles = useDefaultStyles("Root", defaultStyles, styles);

    return (
      <div
        className="root flex flex-col w-full bg-gray-300 justify-start items-start"
        style={_styles.container}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Root.displayName = "Root";
