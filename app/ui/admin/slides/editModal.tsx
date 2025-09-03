"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "@/app/ui/admin/modal/baseAdminModal";
import ImageUploadField from "../form/formImageUploadField";
import FormField from "../form/formField";
import { Loader2, Edit, Upload } from "lucide-react";
import { fetchSlideByIdActions } from "@/app/actions/slideActions";
import { Slide } from "@/app/interface/slide";

interface EditModalProps {
  id: string;
  onClose: () => void;
  onEditSuccess?: (data: any) => void;
}

export default async function EditModal({
  id,
  onClose,
  onEditSuccess,
}: EditModalProps) {
  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDesc, setSelectedDesc] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedRedirectLink, setSelectedRedirectLink] = useState("");

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [editedImageUrl, setEditedImageUrl] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [currentSlideData, setCurrentSlideData] = useState<Slide>();
  useEffect(() => {
    const getData = async () => {
      const currentSlide: Slide = await fetchSlideByIdActions(id);
      setCurrentSlideData(currentSlide);
    };
    getData();
  }, []);
  // Validation TODO => zod
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedTitle.trim()) {
      errors.title = "Title is required";
    }

    if (!selectedDesc.trim()) {
      errors.desc = "Description is required";
    }

    if (!selectedOrder.trim()) {
      errors.order = "Order is required";
    } else if (parseInt(selectedOrder) < 1 || parseInt(selectedOrder) > 100) {
      errors.order = "Order must be between 1 and 100";
    }

    if (!selectedRedirectLink.trim()) {
      errors.redirectLink = "Page link is required";
    }

    if (!selectedFile) {
      errors.file = "Please select an image file";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEdit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setIsEditing(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile!);
      formData.append("folderName", "slides");
      formData.append("title", selectedTitle.trim());
      formData.append("desc", selectedDesc.trim());
      formData.append("link", selectedRedirectLink.trim());
      formData.append("order", selectedOrder.trim());

      const response = await fetch("/api/Edit/slides", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Edit failed");
      }

      const result = await response.json();
      if (result) {
        toast.success("Image edited successfully!");
        setEditedImageUrl(result.imageUrl || "success");

        if (onEditSuccess) {
          onEditSuccess(result);
        }
      }
    } catch (error) {
      console.error("Edit error:", error);
      toast.error("Edit failed. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const resetEdit = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setSelectedTitle("");
    setSelectedDesc("");
    setSelectedOrder("");
    setSelectedRedirectLink("");
    setEditedImageUrl("");
    setFormErrors({});
  };

  const isFormValid =
    selectedFile &&
    selectedTitle.trim() &&
    selectedDesc.trim() &&
    selectedOrder.trim() &&
    selectedRedirectLink.trim() &&
    !isEditing;

  return (
    <BaseModal onClose={onClose} title="Edit Slide" maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Title"
            id="title"
            value={selectedTitle}
            onChange={setSelectedTitle}
            placeholder={selectedTitle}
            required
            disabled={isEditing}
            error={formErrors.title}
          />

          <FormField
            label="Display Order"
            id="order"
            type="number"
            value={selectedOrder}
            onChange={setSelectedOrder}
            placeholder="1"
            required
            disabled={isEditing}
            error={formErrors.order}
            min={1}
            max={100}
          />
        </div>

        <FormField
          label="Description"
          id="desc"
          type="textarea"
          value={selectedDesc}
          onChange={setSelectedDesc}
          placeholder="Describe your slide content..."
          required
          disabled={isEditing}
          error={formErrors.desc}
          rows={4}
        />

        <FormField
          label="Page Link"
          id="redirectLink"
          value={selectedRedirectLink}
          onChange={setSelectedRedirectLink}
          placeholder="/SherlockHolmes/abcBooks/..."
          required
          disabled={isEditing}
          error={formErrors.redirectLink}
        />

        {/* Image Upload Field */}
        <ImageUploadField
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
          previewUrl={previewUrl}
          onPreviewUrlChange={setPreviewUrl}
          disabled={isEditing}
          required
          error={formErrors.file}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          {!editedImageUrl && (
            <button
              onClick={handleEdit}
              disabled={!isFormValid}
              type="button"
              className={`px-8 py-3 font-semibold transition-all flex items-center justify-center gap-2 rounded-lg ${
                isFormValid
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isEditing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Editing...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Edit Slide
                </>
              )}
            </button>
          )}

          {editedImageUrl && (
            <button
              onClick={resetEdit}
              type="button"
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 rounded-lg"
              disabled={isEditing}
            >
              <Upload className="w-4 h-4" />
              Edit Another
            </button>
          )}

          <button
            onClick={onClose}
            type="button"
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors border-2 border-gray-200 hover:border-gray-300 font-medium disabled:opacity-50 rounded-lg"
            disabled={isEditing}
          >
            Cancel
          </button>
        </div>

        {/* Form Status Messages */}
        {!isFormValid && !isEditing && Object.keys(formErrors).length === 0 && (
          <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              Please fill all required fields and select an image to enable edit
            </p>
          </div>
        )}

        {Object.keys(formErrors).length > 0 && !isEditing && (
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              Please fix the errors above before submitting
            </p>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
