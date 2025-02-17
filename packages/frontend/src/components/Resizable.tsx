import "./resizable.css";
import { ReactNode, useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children?: ReactNode;
}

const Resizable = ({ direction, children }: ResizableProps) => {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [horizontalWidth, setHorizontalWidth] = useState(innerWidth * 0.75);

  useEffect(
    () => {
      let timer: string | number | NodeJS.Timeout | undefined;

      const listener = () => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          setInnerHeight(window.innerHeight);
          setInnerWidth(window.innerWidth);
          if (window.innerWidth * 0.75 < horizontalWidth) {
            setHorizontalWidth(Math.floor(window.innerWidth * 0.75));
          }
        }, 100);
      };

      window.addEventListener("resize", listener);

      return () => {
        window.removeEventListener("resize", listener);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const resizableProps: ResizableBoxProps =
    direction === "horizontal"
      ? {
          className: "resize-horizontal",
          minConstraints: [Math.floor(innerWidth * 0.2), Infinity],
          maxConstraints: [Math.floor(innerWidth * 0.75), Infinity],
          height: Infinity,
          width: horizontalWidth,
          resizeHandles: ["e"],
          onResizeStop: (_, data) => {
            setHorizontalWidth(data.size.width);
          },
        }
      : {
          minConstraints: [Infinity, 24],
          maxConstraints: [Infinity, Math.floor(innerHeight * 0.9)],
          height: 300,
          width: Infinity,
          resizeHandles: ["s"],
        };

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
