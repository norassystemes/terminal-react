import * as React from "react";
import * as S from "@radix-ui/react-scroll-area";
import type { DefaultProps } from "./types";
import { rem, useDefaultStyles } from "./utils";

/**
 * https://mantine.dev/core/scroll-area/
 */

type Names = "root" | "viewport" | "scrollbar" | "thumb" | "corner";
export interface ScrollAreaProps
  extends DefaultProps<Names>,
    React.ComponentPropsWithRef<"div"> {
  /** Scrollbar size */
  scrollbarSize?: number | string;

  /** Scrollbars type */
  type?: "auto" | "always" | "scroll" | "hover" | "never";

  /** Scroll hide delay in ms, for scroll and hover types only */
  scrollHideDelay?: number;

  /** Should scrollbars be offset with padding */
  offsetScrollbars?: boolean;

  /** Get viewport ref */
  viewportRef?: React.ForwardedRef<HTMLDivElement>;

  /** Props added to the viewport element */
  viewportProps?: React.ComponentPropsWithRef<"div">;

  /** Subscribe to scroll position changes */
  onScrollPositionChange?(position: { x: number; y: number }): void;
}
export interface ScrollAreaStylesParams {
  scrollbarSize: number | string;
  offsetScrollbars: boolean;
  scrollbarHovered: boolean;
  hidden: boolean;
}

const defaultStyles = ({
  offsetScrollbars,
  scrollbarSize,
  hidden,
  scrollbarHovered,
}: ScrollAreaStylesParams) => ({
  root: {
    height: "100%",
  },
  viewport: {
    paddingRight: offsetScrollbars ? rem(scrollbarSize) : undefined,
    paddingBottom: offsetScrollbars ? rem(scrollbarSize) : undefined,
  },
  scrollbar: {
    display: hidden ? "none" : "flex",
    padding: `calc(${rem(scrollbarSize)}  / 5)`,
    transition: "background-color 150ms ease, opacity 150ms ease",
  },
  thumb: {
    transition: "background-color 150ms ease",
    display: hidden ? "none" : undefined,
  },
  corner: {
    transition: "opacity 150ms ease",
    opacity: scrollbarHovered ? 1 : 0,
    display: hidden ? "none" : undefined,
  },
});
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (props, ref) => {
    const {
      type = "hover",
      scrollHideDelay = 1000,
      scrollbarSize = 12,
      offsetScrollbars = false,
      children,
      styles = {},
      viewportProps,
      viewportRef,
      onScrollPositionChange,
      ...rest
    } = props;
    const [scrollbarHovered, setScrollbarHovered] = React.useState(false);

    const _styles = useDefaultStyles(
      "ScrollArea",
      defaultStyles({
        offsetScrollbars,
        hidden: type === "never",
        scrollbarHovered,
        scrollbarSize,
      }),
      styles
    );

    return (
      <div className="flex h-full" ref={ref} {...rest}>
        <div className="flex flex-col flex-1 max-w-full">
          <S.Root
            className="overflow-hidden"
            type={type === "never" ? "always" : type}
            scrollHideDelay={scrollHideDelay}
            asChild
          >
            <div style={_styles.root}>
              <S.Viewport
                className="w-full h-full"
                style={_styles.viewport}
                {...viewportProps}
                ref={viewportRef}
                onScroll={
                  typeof onScrollPositionChange === "function"
                    ? ({ currentTarget }) =>
                        onScrollPositionChange({
                          x: currentTarget.scrollLeft,
                          y: currentTarget.scrollTop,
                        })
                    : undefined
                }
              >
                {children}
              </S.Viewport>
              <S.Scrollbar
                className="select-none touch-none bg-gray-900/10 transition-all hover:bg-gray-900/20 data-[data-orientation=horizontal]:flex-col data-[data-orientation=horizontal]:h-4 data-[data-orientation=vertical]:w-4 data-[data-state=hidden]:hidden data-[data-state=hidden]:opacity-0 "
                style={_styles.scrollbar}
                orientation="horizontal"
                forceMount
                onMouseEnter={() => setScrollbarHovered(true)}
                onMouseLeave={() => setScrollbarHovered(false)}
              >
                <S.Thumb className="flex-1 bg-gray-300 rounded-sm relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:transform before:translate-x-1/2 before:translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
              </S.Scrollbar>
              <S.Scrollbar
                className="select-none touch-none bg-gray-900/10 transition-all hover:bg-gray-900/20 data-[data-orientation=horizontal]:flex-col data-[data-orientation=horizontal]:h-4 data-[data-orientation=vertical]:w-4 data-[data-state=hidden]:hidden data-[data-state=hidden]:opacity-0 "
                style={_styles.scrollbar}
                orientation="vertical"
                forceMount
                onMouseEnter={() => setScrollbarHovered(true)}
                onMouseLeave={() => setScrollbarHovered(false)}
              >
                <S.Thumb
                  className="flex-1 bg-gray-300 rounded-sm relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:transform before:translate-x-1/2 before:translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
                  style={_styles.thumb}
                />
              </S.Scrollbar>
              <S.Corner className="bg-gray-900/20" style={_styles.corner} />
            </div>
          </S.Root>
        </div>
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";
