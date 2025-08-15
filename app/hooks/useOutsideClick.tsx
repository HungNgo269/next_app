import { useEffect, RefObject } from "react";

export function useOutsideClick(
  refs: Array<RefObject<HTMLElement | null>>,
  onOutside?: (e: MouseEvent) => void
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInside = refs.some(
        (r) => r?.current && r.current.contains(target)
      );
      if (!clickedInside) onOutside?.(e);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [refs, onOutside]);
}
