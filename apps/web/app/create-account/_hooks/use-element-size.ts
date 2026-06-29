"use client";

import { useEffect, useRef, useState } from "react";

type ElementSize = {
  height: number;
  width: number;
};

export function useElementSize<TElement extends HTMLElement>() {
  const ref = useRef<TElement | null>(null);
  const [size, setSize] = useState<ElementSize>({ height: 0, width: 0 });

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect();

      setSize({
        height: rect.height,
        width: rect.width
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, []);

  return { ref, size };
}
