import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Upload, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { z } from "zod";
import { fileSchema } from "@/app/schema/fileUploadSchema";

interface ImageUploadFieldProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  previewUrl: string;
  onPreviewUrlChange: (url: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  onValidation?: (fieldName: string, error: string | null) => void;
  validateOnChange?: boolean;
}

export default function ImageUploadField({
  selectedFile,
  onFileSelect,
  previewUrl,
  onPreviewUrlChange,
  disabled = false,
  required = false,
  error = "",
  className = "",
  onValidation,
  validateOnChange = true,
}: ImageUploadFieldProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string>("");
  const [isValidFile, setIsValidFile] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const fileReaderRef = useRef<FileReader | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Use external error or local error
  const displayError = error || (isTouched ? localError : "");

  useEffect(() => {
    return () => {
      if (fileReaderRef.current) {
        fileReaderRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (error) {
      setLocalError("");
    }
  }, [error]);

  const validateFile = (file: File | null): string | null => {
    if (!file) {
      return required ? "Please select an image file" : null;
    }

    try {
      fileSchema.parse(file);
      return null;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return validationError.errors[0]?.message || "Invalid file";
      }
      return "Invalid file";
    }
  };

  const handleFileSelect = (file: File) => {
    setIsTouched(true);

    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      setIsValidFile(false);
      if (onValidation) {
        onValidation("file", validationError);
      }
      return;
    }

    setLocalError("");
    setIsValidFile(true);
    onFileSelect(file);

    if (onValidation) {
      onValidation("file", null);
    }

    // Read file for preview
    const reader = new FileReader();
    fileReaderRef.current = reader;

    reader.onload = (e) => {
      onPreviewUrlChange(e.target?.result as string);
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
      setLocalError("Failed to read file");
      setIsValidFile(false);
      fileReaderRef.current = null;
      if (onValidation) {
        onValidation("file", "Failed to read file");
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    } else {
      setIsTouched(true);
      if (required) {
        setLocalError("Please select an image file");
        if (onValidation) {
          onValidation("file", "Please select an image file");
        }
      }
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

  const handleChooseDifferentImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetUpload = () => {
    if (fileReaderRef.current) {
      fileReaderRef.current.abort();
      fileReaderRef.current = null;
    }
    onFileSelect(null);
    onPreviewUrlChange("");
    setLocalError("");
    setIsValidFile(false);
    setIsTouched(false);
    if (onValidation) {
      onValidation("file", required ? "Please select an image file" : null);
    }
  };

  // Determine border and background colors based on state
  const getBorderColors = () => {
    if (displayError) return "border-red-300 bg-red-50";
    if (isDragOver) return "border-blue-400 bg-blue-50";
    if (isValidFile) return "border-green-300 bg-green-50";
    return "border-gray-300 hover:border-gray-400 hover:bg-gray-50";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-gray-700">
        Image {required && <span className="text-red-500">*</span>}
        {isValidFile && (
          <CheckCircle className="inline w-4 h-4 text-green-600 ml-1" />
        )}
        {displayError && (
          <AlertCircle className="inline w-4 h-4 text-red-600 ml-1" />
        )}
      </label>

      <div
        className={`relative border-2 border-dashed transition-all rounded-lg ${getBorderColors()}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          id="fileInput"
          required={required}
          disabled={disabled}
        />

        {previewUrl ? (
          // Image Preview
          <div className="relative w-full h-64 bg-gray-100 overflow-hidden rounded-lg">
            <Image
              src={previewUrl}
              alt="Selected image"
              fill
              className="object-contain"
            />
            {/* Success indicator overlay */}
            {isValidFile && (
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
            {/* Hover overlay with image info and action button */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 text-center text-white">
                <div className="space-y-2">
                  <p className="font-medium">{selectedFile?.name}</p>
                  <p className="text-sm">
                    {selectedFile
                      ? (selectedFile.size / 1024 / 1024).toFixed(2)
                      : "0"}{" "}
                    MB
                  </p>
                  <button
                    type="button"
                    onClick={handleChooseDifferentImage}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center gap-2 mx-auto rounded-lg"
                    disabled={disabled}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Choose Different Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Default Upload State
          <div className="p-8 text-center space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <div
                className={`p-3 rounded-lg ${
                  isValidFile ? "bg-green-100" : "bg-blue-100"
                }`}
              >
                <Upload
                  className={`w-8 h-8 ${
                    isValidFile ? "text-green-600" : "text-blue-600"
                  }`}
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Drop your image here, or{" "}
                  <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                    browse
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports: JPG, PNG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {selectedFile && (
          <button
            type="button"
            onClick={handleChooseDifferentImage}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors flex items-center justify-center gap-2 rounded-lg"
            disabled={disabled}
          >
            <RefreshCw className="w-4 h-4" />
            Choose Different Image
          </button>
        )}

        {selectedFile && (
          <button
            type="button"
            onClick={resetUpload}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm border border-gray-200 hover:border-gray-300 rounded-lg"
            disabled={disabled}
          >
            Clear
          </button>
        )}
      </div>

      {/* Error Message */}
      {displayError && (
        <p className="text-red-600 text-sm flex items-center gap-1 animate-fadeIn">
          <AlertCircle className="w-4 h-4" />
          {displayError}
        </p>
      )}

      {/* Success Message */}
      {isTouched && !displayError && selectedFile && isValidFile && (
        <p className="text-green-600 text-sm flex items-center gap-1 animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          Image is valid and ready for upload
        </p>
      )}

      {/* File Info */}
      {selectedFile && isValidFile && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
          <p>
            <span className="font-medium">Name:</span> {selectedFile.name}
          </p>
          <p>
            <span className="font-medium">Size:</span>{" "}
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <p>
            <span className="font-medium">Type:</span> {selectedFile.type}
          </p>
        </div>
      )}
    </div>
  );
}
