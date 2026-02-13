import { useState, useRef, useEffect, RefObject } from "react";

const MIN_COL_WIDTH = 300;
const MAX_COLS = 6;
const MOBILE_BREAKPOINT = 768;
const MOBILE_COLS = 2;

type DependencyList = ReadonlyArray<unknown>;

export function useResponCols(
  deps: DependencyList = [],
): [RefObject<HTMLDivElement | null>, number] {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(3);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (window.innerWidth < MOBILE_BREAKPOINT) {
          setCols(MOBILE_COLS);
        } else {
          const calculated = Math.max(
            1,
            Math.min(MAX_COLS, Math.floor(width / MIN_COL_WIDTH)),
          );
          setCols(calculated);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, deps as DependencyList);

  return [containerRef, cols];
}
