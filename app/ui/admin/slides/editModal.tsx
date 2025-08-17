"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import BaseModal from "@/app/ui/admin/modal/baseAdminModal";

interface EditModalProps {
  onClose: () => void;
}

export default function EditModal({ onClose }: EditModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDesc, setSelectedDesc] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedRedirectLink, setSelectedRedirectLink] = useState("");
  const [Editing, setEditing] = useState(false);
  const [EditedImageUrl, setEditedImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const fileReaderRef = useRef<FileReader | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (fileReaderRef.current) {
        fileReaderRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      fileReaderRef.current = reader;

      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };

      reader.onerror = () => {
        toast.error("Failed to read file");
        fileReaderRef.current = null;
      };

      reader.readAsDataURL(file);
    }
  };

  const handleLabelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Trigger file input click programmatically
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleEdit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setEditing(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folderName", "slides");
      formData.append("title", selectedTitle);
      formData.append("desc", selectedDesc);
      formData.append("link", selectedRedirectLink);
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

        timeoutRef.current = setTimeout(() => {
          onClose();
          timeoutRef.current = null;
        }, 1500);
      }
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("Edit failed. Please try again.");
    } finally {
      setEditing(false);
    }
  };

  const resetEdit = () => {
    if (fileReaderRef.current) {
      fileReaderRef.current.abort();
      fileReaderRef.current = null;
    }

    setSelectedFile(null);
    setPreviewUrl("");
    setEditedImageUrl("");
  };

  return (
    <BaseModal
      onClose={onClose}
      title="Edit Image to Cloudinary"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
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
              value={selectedTitle}
              placeholder="Enter title"
              onChange={(e) => setSelectedTitle(e.target.value)}
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
              max={100}
              type="number"
              id="orderInput"
              value={selectedOrder}
              placeholder="Display order"
              onChange={(e) => setSelectedOrder(e.target.value)}
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
              value={selectedDesc}
              placeholder="Enter description..."
              rows={4}
              onChange={(e) => setSelectedDesc(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              value={selectedRedirectLink}
              placeholder="ex: /SherlockHolmes/abcBooks/..."
              onChange={(e) => setSelectedRedirectLink(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
          <button
            type="button"
            onClick={handleLabelClick}
            className="cursor-pointer inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Choose Image
          </button>
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

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {selectedFile && !EditedImageUrl && (
            <button
              onClick={handleEdit}
              disabled={Editing}
              type="button"
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {Editing ? "Editing..." : "Edit image"}
            </button>
          )}

          {EditedImageUrl && (
            <button
              onClick={resetEdit}
              type="button"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Edit Another Image
            </button>
          )}

          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
