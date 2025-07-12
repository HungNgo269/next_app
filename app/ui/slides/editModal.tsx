"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface EditModalProps {
  onClose: () => void;
  onEditSuccess: (imageUrl: string) => void;
}

export default function EditModal({ onClose, onEditSuccess }: EditModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDesc, setSelectedDesc] = useState("");
  const [selectedOrder, setSelectedOder] = useState("");

  const [selectedRedirectLink, setSelectedRedirectLink] = useState("");

  const [Editing, setEditing] = useState(false);
  const [EditedImageUrl, setEditedImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Tạo preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const desc = e.target.value;
    if (desc) {
      setSelectedDesc(desc);
    }
  };
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (title) {
      setSelectedTitle(title);
    }
  };
  const handleOrder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const order = e.target.value;
    if (order) {
      setSelectedOder(order);
    }
  };
  const handleRedirectLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    const redirectLink = e.target.value;
    if (redirectLink) {
      setSelectedRedirectLink(selectedRedirectLink);
    }
  };
  const handleEdit = async () => {
    if (!selectedFile) return;
    setEditing(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folderName", "slides");
      formData.append("title", selectedTitle);
      formData.append("desc", selectedDesc);
      formData.append("link", selectedDesc);
      formData.append("order", selectedOrder);

      const response = await fetch("/api/Edit/slides", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Edit failed");
      }

      const result = await response.json();
      if (result) {
        toast.success("Edited File Successful");
      }
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("Edit failed. Please try again.");
    } finally {
      setEditing(false);
    }
  };

  const resetEdit = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setEditedImageUrl("");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Image to Cloudinary</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="titleInput"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="titleInput"
                placeholder="Enter title"
                onChange={handleTitle}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="orderInput"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Order
              </label>
              <input
                min={1}
                type="number"
                id="orderInput"
                placeholder="Display order"
                onChange={handleOrder}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="descInput"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="descInput"
                placeholder="Enter description..."
                rows={4}
                onChange={handleDesc}
                className="px-4 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="redirectLinkInput"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Page link
            </label>
            <input
              type="text"
              id="redirectLinkInput"
              placeholder="ex: /SherlockHolmes/abcBooks/..."
              onChange={handleRedirectLink}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Choose Image
            </label>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Preview Image */}
          {previewUrl && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Preview:</h3>
              <div className="relative w-full h-64">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Edit Button */}
          {selectedFile && !EditedImageUrl && (
            <div className="text-center">
              <button
                onClick={handleEdit}
                disabled={Editing}
                className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {Editing ? "Editing..." : "Edit image"}
              </button>
            </div>
          )}

          {EditedImageUrl && (
            <div className="flex flex-row justify-center items-center">
              <button
                onClick={resetEdit}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Edit Another Image
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-4 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
