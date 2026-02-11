import { useState, useRef, useEffect, RefObject } from "react";

export function useInView(options?: IntersectionObserverInit): [RefObject<HTMLDivElement | null>, boolean] {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "200px", ...options }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}
