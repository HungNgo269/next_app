"use client";
import BookUploadModal from "@/app/ui/admin/books/bookUploadModal";
import SlideUploadModal from "@/app/ui/admin/slides/slideUploadModal";
import UploadModal from "@/app/ui/admin/slides/slideUploadModal";
import { useState } from "react";
interface props {
  name: string;
}
export default function UserActions({ name }: props) {
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
        <h1 className="text-3xl font-bold">{name} Management</h1>
        <button
          onClick={handleUploadClick}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
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
          Upload {name}
        </button>
      </div>
      {showUploadModal && name === "Slide" && (
        <SlideUploadModal
          onClose={handleCloseModal}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
      {showUploadModal && name === "Book" && (
        <BookUploadModal
          onClose={handleCloseModal}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
