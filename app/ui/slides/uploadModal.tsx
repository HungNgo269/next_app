"use client";

import type React from "react";

import { useState, useRef, useEffect, useActionState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { uploadSlideAction } from "./uploadModalAction";
import { X, Upload, ImageIcon, Loader2, CheckCircle } from "lucide-react";

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: (imageUrl: string) => void;
}

export default function UploadModal({
  onClose,
  onUploadSuccess,
}: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const [formKey, setFormKey] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileReaderRef = useRef<FileReader | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [state, formAction, isPending] = useActionState(
    uploadSlideAction,
    null
  );

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

  useEffect(() => {
    if (state?.success && state.imageUrl) {
      toast.success(state.message);
      onUploadSuccess(state.imageUrl);
      timeoutRef.current = setTimeout(() => {
        onClose();
        timeoutRef.current = null;
      }, 1500);
    } else if (state && !state.success) {
      toast.error(state.message);
    }
  }, [state, onUploadSuccess, onClose]);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Please select an image file";
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    setFileError("");
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    fileReaderRef.current = reader;
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
      setFileError("Failed to read file");
      fileReaderRef.current = null;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const resetUpload = () => {
    if (fileReaderRef.current) {
      fileReaderRef.current.abort();
      fileReaderRef.current = null;
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setFileError("");
    setFormKey((prev) => prev + 1);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return state?.errors?.[fieldName]?.[0];
  };

  const isFormValid = selectedFile && !fileError && !isPending;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Image</h2>
            <p className="text-sm text-gray-600 mt-1">
              Add a new slide to your collection
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-full transition-colors disabled:opacity-50"
            disabled={isPending}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <form key={formKey} action={formAction} className="p-6 space-y-6">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter slide title"
                  required
                  disabled={isPending}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 ${
                    getFieldError("title")
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                {getFieldError("title") && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {getFieldError("title")}
                  </p>
                )}
              </div>

              {/* Order Field */}
              <div className="space-y-2">
                <label
                  htmlFor="order"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Display Order <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  id="order"
                  name="order"
                  placeholder="1"
                  required
                  disabled={isPending}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 ${
                    getFieldError("order")
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                {getFieldError("order") && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {getFieldError("order")}
                  </p>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label
                htmlFor="desc"
                className="block text-sm font-semibold text-gray-700"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="desc"
                name="desc"
                placeholder="Describe your slide content..."
                rows={4}
                required
                disabled={isPending}
                className={`w-full px-4 py-3 border-2 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 ${
                  getFieldError("desc")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              />
              {getFieldError("desc") && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {getFieldError("desc")}
                </p>
              )}
            </div>

            {/* Redirect Link Field */}
            <div className="space-y-2">
              <label
                htmlFor="redirectLink"
                className="block text-sm font-semibold text-gray-700"
              >
                Page Link <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="redirectLink"
                name="redirectLink"
                placeholder="/SherlockHolmes/abcBooks/..."
                required
                disabled={isPending}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 ${
                  getFieldError("redirectLink")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              />
              {getFieldError("redirectLink") && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {getFieldError("redirectLink")}
                </p>
              )}
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Image <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  isDragOver
                    ? "border-blue-400 bg-blue-50"
                    : fileError
                    ? "border-red-300 bg-red-50"
                    : selectedFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  id="fileInput"
                  required
                  disabled={isPending}
                />

                <div className="space-y-4">
                  {selectedFile ? (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 bg-green-100 rounded-full">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Drop your image here, or{" "}
                          <span className="text-blue-600">browse</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports: JPG, PNG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {fileError && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {fileError}
                </p>
              )}
            </div>

            {/* Preview Image */}
            {previewUrl && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Preview
                </h3>
                <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={previewUrl || }
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              {!state?.success && (
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    isFormValid
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Slide
                    </>
                  )}
                </button>
              )}

              {state?.success && (
                <button
                  onClick={resetUpload}
                  type="button"
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                  disabled={isPending}
                >
                  <Upload className="w-4 h-4" />
                  Upload Another
                </button>
              )}

              <button
                onClick={onClose}
                type="button"
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors border-2 border-gray-200 hover:border-gray-300 rounded-xl font-medium disabled:opacity-50"
                disabled={isPending}
              >
                Cancel
              </button>
            </div>

            {/* Form Status Messages */}
            {!isFormValid && !isPending && (
              <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-700">
                  Please fill all required fields and select an image to enable
                  upload
                </p>
              </div>
            )}

            {state && !state.success && !state.errors && (
              <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                <p className="text-sm text-red-700">{state.message}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
