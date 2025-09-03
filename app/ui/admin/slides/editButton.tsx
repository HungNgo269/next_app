"use client";
import { useState } from "react";
import EditModal from "./editModal";
import { PencilIcon } from "@heroicons/react/24/outline";

interface SlideButtonProps {
  id: string;
}

export default async function EditButton({ id }: SlideButtonProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  return (
    <>
      <button
        onClick={handleEditClick}
        type="button"
        className="cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors"
        aria-label="Edit item"
      >
        <PencilIcon className="w-5 h-5" />
      </button>

      {showEditModal && <EditModal onClose={handleCloseModal} id={id} />}
    </>
  );
}
