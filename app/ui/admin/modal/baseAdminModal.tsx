import React from "react";
import { useModalBehavior } from "@/app/hooks/useModal";

interface BaseModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  maxWidth?: string;
  showHeader?: boolean;
}

export default function BaseModal({
  children,
  onClose,
  title,
  maxWidth = "max-w-2xl",
  showHeader = true,
}: BaseModalProps) {
  const { handleBackdropClick } = useModalBehavior(onClose);

  const handleCloseClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg ${maxWidth} w-full mx-4 max-h-[90vh] overflow-y-auto`}
      >
        {showHeader && (
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button
              onClick={handleCloseClick}
              className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
              type="button"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
