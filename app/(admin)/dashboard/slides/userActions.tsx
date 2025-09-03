"use client";
import UploadModal from "@/app/ui/admin/slides/uploadModal";
import { useState } from "react";

export default function UserActions() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
  };

  const handleUploadSuccess = (imageUrl: string) => {
    setShowUploadModal(false);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Slides Management</h1>
        <button
          onClick={handleUploadClick}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Upload Slides
        </button>
      </div>

      {showUploadModal && (
        <UploadModal
          onClose={handleCloseModal}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
