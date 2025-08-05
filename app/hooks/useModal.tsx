import { useEffect, useCallback } from "react";

type OnClose = () => void;

export const useEscapeKey = (onClose: OnClose): void => {
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);
};

export const useBodyScrollLock = (): void => {
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
};

export const useBackdropClick = (onClose: OnClose) => {
  return useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );
};

export const useModalBehavior = (onClose: OnClose) => {
  useEscapeKey(onClose);
  useBodyScrollLock();
  const handleBackdropClick = useBackdropClick(onClose);

  return { handleBackdropClick };
};
