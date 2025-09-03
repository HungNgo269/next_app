import BaseModal from "./baseAdminModal";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <BaseModal onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-6">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 border border-red-200">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm Delete
          </h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors font-medium"
            type="button"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
