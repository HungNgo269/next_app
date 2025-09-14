"use client";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline"; // Có thể làm prop nếu muốn thay icon
import toast from "react-hot-toast";

interface GenericDeleteButtonProps {
  id: string; // Giữ id nếu cần, nhưng onDelete có thể không dùng nếu closure
  onDelete: () => Promise<{ success: boolean; error?: string }>; // Action truyền vào
  confirmMessage?: string; // Text cho modal, default: "Are you sure you want to delete this item?"
  successMessage?: string; // Text cho toast success, default: "Delete success"
}

export default function GenericDeleteButton({
  id, // Không bắt buộc dùng trong component, tùy onDelete
  onDelete,
  confirmMessage = "Are you sure you want to delete this item?",
  successMessage = "Delete success",
}: GenericDeleteButtonProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleShowModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  const handleDeleteClick = async () => {
    try {
      setIsDeleting(true);
      const result = await onDelete();

      if (result.success) {
        setShowConfirmModal(false);
        toast.success(successMessage);
      } else {
        console.error("Delete failed:", result.error);
        toast.error(result.error || "Delete failed");
      }
    } catch (error) {
      toast.error("Can not delete this item");
      console.error("Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleShowModal}
        type="button"
        className="cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors"
        aria-label="Delete item"
        disabled={isDeleting}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
      {showConfirmModal && ""}
    </>
  );
}
