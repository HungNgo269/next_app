import BaseModal from "./baseAdminModal";
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
    <BaseModal onClose={onClose} maxWidth="max-w-sm">
      <div className="space-y-4">
        <p>{message}</p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
