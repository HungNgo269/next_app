"use client";
import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function EditButton() {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleEditSuccess = (imageUrl: string) => {
    setShowEditModal(false);
  };
  return (
    <div className="cursor-pointer" onClick={handleEditClick}>
      <PencilIcon className="w-5" />

      {/* {showEditModal && (
        <EditModal
          onClose={handleCloseModal}
          onEditSuccess={handleEditSuccess}
        />
      )} */}
    </div>
  );
}
