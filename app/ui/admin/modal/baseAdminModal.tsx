import React from "react";
import { X } from "lucide-react";
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {showHeader && (
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
            {title ? (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            ) : (
              <div className="hidden">sads</div>
            )}

            <button
              onClick={handleCloseClick}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-end"
              type="button"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
