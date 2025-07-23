"use client";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "../modal/confirmModal";
import { deleteSlide } from "@/app/(admin)/dashboard/slides/actions";
import toast from "react-hot-toast";
interface DeleteButtonProps {
  slideId: string;
}
export default function DeleteButton({ slideId }: DeleteButtonProps) {
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
      const result = await deleteSlide(slideId);

      if (result.success) {
        setShowConfirmModal(false);
        toast.success("Delete slide success");
      } else {
        console.error("Delete failed:", result.error);
      }
    } catch (error) {
      toast.error("Can not delete this slide");
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
      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete this slide?"
          onConfirm={handleDeleteClick}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
