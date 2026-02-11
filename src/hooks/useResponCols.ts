import { useState, useRef, useEffect, RefObject } from "react";

export function useResponCols(deps: any[] = []): [RefObject<HTMLDivElement | null>, number] {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(4);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width < 380) setCols(1);
        else if (width < 620) setCols(1);
        else if (width < 900) setCols(2);
        else if (width < 1200) setCols(3);
        else if (width < 1550) setCols(5);
        else setCols(6);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, deps);

  return [containerRef, cols];
}
