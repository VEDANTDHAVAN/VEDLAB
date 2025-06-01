import { useRef, useEffect } from "react";

export function useBoundingClientRectRef(ref: React.RefObject<HTMLElement>) {
  const rectRef = useRef<DOMRect>(new DOMRect());

  useEffect(() => {
    if (!ref.current) return;

    const updateRect = () => {
      if (ref.current) {
        rectRef.current = ref.current.getBoundingClientRect();
      }
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, [ref]);

  return rectRef;
} 