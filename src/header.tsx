import * as React from "react";
import type { DefaultProps } from "./types";
import { useDefaultStyles } from "./utils";

type Names = "title" | "root" | "close" | "minimize" | "zoom";

export interface HeaderProps
  extends DefaultProps<Names>,
    React.ComponentPropsWithoutRef<"div"> {
  onClose?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMinimize?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onZoom?: (e: React.MouseEvent<HTMLDivElement>) => void;
  h?: number;
}

export const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  (props, ref) => {
    const {
      children,
      onClose,
      onMinimize,
      onZoom,
      styles = {},
      h,
      ...rest
    } = props;
    const _styles = useDefaultStyles(
      "Header",
      {
        root: {
          height: `${h}px`,
        },
      },
      styles
    );

    return (
      <div
        className="bg-gray-300 py-1 w-full flex justify-start items-center shadow-sm"
        style={_styles.root}
        ref={ref}
        {...rest}
      >
        <div className="flex justify-start items-center h-full mr-12">
          <div
            onClick={onClose}
            className="cursor-pointer bg-red-500 rounded-full h-3 w-3 mr-1 ml-2 group flex items-center justify-center"
            style={_styles.close}
          >
            <div className="text-red-900 h-2 w-2 group-hover:opacity-100 opacity-0">
              <Close />
            </div>
          </div>
          <div
            onClick={onMinimize}
            className="cursor-pointer bg-yellow-500 rounded-full h-3 w-3 mr-1 group flex items-center justify-center"
            style={_styles.close}
          >
            <div className="text-yellow-900 h-2 w-2 group-hover:opacity-100 opacity-0">
              <Minimize />
            </div>
          </div>
          <div
            onClick={onZoom}
            className="cursor-pointer bg-green-500 rounded-full h-3 w-3 mr-1 group flex items-center justify-center"
            style={_styles.close}
          >
            <div className="text-green-900 h-2 w-2 group-hover:opacity-100 opacity-0">
              <Zoom />
            </div>
          </div>
        </div>
        <p
          className="truncate font-mono text-center mr-auto ml-auto"
          style={_styles.title}
        >
          {children}
        </p>
      </div>
    );
  }
);

Header.displayName = "Header";

interface CloseProps extends React.ComponentPropsWithoutRef<"svg"> {}
const Close = React.forwardRef<SVGSVGElement, CloseProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      ref={ref}
      {...rest}
    >
      <title>Close</title>
      <path
        d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
        fill="currentColor"
      />
    </svg>
  );
});
Close.displayName = "Close";

interface MinimizeProps extends React.ComponentPropsWithoutRef<"svg"> {}
const Minimize = React.forwardRef<SVGSVGElement, MinimizeProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        ref={ref}
        {...rest}
      >
        <title>Minimize</title>
        <path
          d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);
Minimize.displayName = "Minimize";

interface ZoomProps extends React.ComponentPropsWithoutRef<"svg"> {}
const Zoom = React.forwardRef<SVGSVGElement, ZoomProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      ref={ref}
      {...rest}
    >
      <title>Zoom</title>
      <path
        d="M12.3062 16.5933L12.2713 18.593L5.2724 18.4708L5.39457 11.4719L7.39426 11.5068L7.33168 15.092L15.2262 7.46833L11.6938 7.40668L11.7287 5.40698L18.7277 5.52915L18.6055 12.5281L16.6058 12.4932L16.6693 8.85507L8.72095 16.5307L12.3062 16.5933Z"
        fill="currentColor"
      />
    </svg>
  );
});
Zoom.displayName = "Zoom";
