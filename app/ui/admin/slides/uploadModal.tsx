"use client";

import type React from "react";
import { useState, useRef, useEffect, useActionState } from "react";
import toast from "react-hot-toast";
import { uploadSlideAction } from "./uploadModalAction";
import { X, Upload, Loader2 } from "lucide-react";
import ImageUploadField from "../form/formImageUploadField";
import FormField from "../form/formField";

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
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [order, setOrder] = useState("");
  const [redirectLink, setRedirectLink] = useState("");
  const [formKey, setFormKey] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [state, formAction, isPending] = useActionState(
    uploadSlideAction,
    null
  );

  useEffect(() => {
    return () => {
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

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setTitle("");
    setDesc("");
    setOrder("");
    setRedirectLink("");
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

  const isFormValid =
    selectedFile &&
    title.trim() &&
    desc.trim() &&
    order.trim() &&
    redirectLink.trim() &&
    !isPending;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white max-w-3xl w-full max-h-[95vh] overflow-hidden shadow-2xl rounded-lg">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-accent/5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Image</h2>
            <p className="text-sm text-gray-600 mt-1">
              Add a new slide to your collection
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors disabled:opacity-50"
            disabled={isPending}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <form key={formKey} action={formAction} className="p-6 space-y-6">
            {/* Hidden inputs for file data - these will be handled by the action */}
            <input type="hidden" name="title" value={title} />
            <input type="hidden" name="desc" value={desc} />
            <input type="hidden" name="order" value={order} />
            <input type="hidden" name="redirectLink" value={redirectLink} />

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Title"
                id="titleDisplay"
                value={title}
                onChange={setTitle}
                placeholder="Enter slide title"
                required
                disabled={isPending}
                error={getFieldError("title")}
              />

              <FormField
                label="Display Order"
                id="orderDisplay"
                type="number"
                value={order}
                onChange={setOrder}
                placeholder="1"
                required
                disabled={isPending}
                error={getFieldError("order")}
                min={1}
              />
            </div>

            <FormField
              label="Description"
              id="descDisplay"
              type="textarea"
              value={desc}
              onChange={setDesc}
              placeholder="Describe your slide content..."
              required
              disabled={isPending}
              error={getFieldError("desc")}
              rows={4}
            />

            <FormField
              label="Page Link"
              id="redirectLinkDisplay"
              value={redirectLink}
              onChange={setRedirectLink}
              placeholder="/SherlockHolmes/abcBooks/..."
              required
              disabled={isPending}
              error={getFieldError("redirectLink")}
            />

            {/* Image Upload Field */}
            <ImageUploadField
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              previewUrl={previewUrl}
              onPreviewUrlChange={setPreviewUrl}
              disabled={isPending}
              required
              error={getFieldError("file")}
            />

            {/* Hidden file input for form submission */}
            {selectedFile && (
              <input
                type="file"
                name="file"
                className="hidden"
                ref={(input) => {
                  if (input && selectedFile) {
                    // Create a new FileList containing our selected file
                    const fileList = new DataTransfer();
                    fileList.items.add(selectedFile);
                    input.files = fileList.files;
                  }
                }}
              />
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              {!state?.success && (
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`px-8 py-3 font-semibold transition-all flex items-center justify-center gap-2 rounded-lg ${
                    isFormValid
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 rounded-lg"
                  disabled={isPending}
                >
                  <Upload className="w-4 h-4" />
                  Upload Another
                </button>
              )}

              <button
                onClick={onClose}
                type="button"
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors border-2 border-gray-200 hover:border-gray-300 font-medium disabled:opacity-50 rounded-lg"
                disabled={isPending}
              >
                Cancel
              </button>
            </div>

            {/* Form Status Messages */}
            {!isFormValid && !isPending && (
              <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700">
                  Please fill all required fields and select an image to enable
                  upload
                </p>
              </div>
            )}

            {state && !state.success && !state.errors && (
              <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{state.message}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
