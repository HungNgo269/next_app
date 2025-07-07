"use client";

import { useState } from "react";
import Image from "next/image";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
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

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload/slides", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadedImageUrl(data.url);
      console.log("Upload successful:", data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadedImageUrl("");
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Upload Image to Cloudinary
      </h1>

      <div className="space-y-6">
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

        {/* Upload Button */}
        {selectedFile && !uploadedImageUrl && (
          <div className="text-center">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? "Uploading..." : "Upload to Cloudinary"}
            </button>
          </div>
        )}

        {/* Upload Result */}
        {uploadedImageUrl && (
          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="text-lg font-semibold mb-2 text-green-800">
              Upload Successful!
            </h3>
            <div className="space-y-4">
              <div className="relative w-full h-64">
                <Image
                  src={uploadedImageUrl}
                  alt="Uploaded image"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <p className="font-medium">Cloudinary URL:</p>
                <p className="break-all text-blue-600">{uploadedImageUrl}</p>
              </div>
              <button
                onClick={resetUpload}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Upload Another Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
