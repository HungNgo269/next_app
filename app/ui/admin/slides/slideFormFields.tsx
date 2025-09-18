"use client";

import { fetchSlideByIdActions } from "@/app/actions/slideActions";
// Local type to avoid missing hook import
type UseSlideFormReturn = {
  formData: {
    title: string;
    order: string | number;
    desc: string;
    redirectLink: string;
  };
  errors: Record<string, string[]>;
  setField: (field: string, value: string) => void;
};
import React from "react";

interface SlideFormFieldsProps {
  formHook: UseSlideFormReturn;
  disabled?: boolean;
  slideId?: string;
}

export default async function SlideFormFields({
  formHook,
  disabled = false,
  slideId,
}: SlideFormFieldsProps) {
  const { formData, errors, setField } = formHook;
  // const data: Slide = await fetchSlideByIdActions(slideId);
  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName]?.[0];
  };

  return (
    <div className="space-y-6">
      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title Field */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700"
          >
            Title <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter slide title"
            value={formData.title}
            onChange={(e) => setField("title", e.target.value)}
            required
            disabled={disabled}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 ${
              getFieldError("title")
                ? "border-destructive/30 bg-destructive/10"
                : "border-gray-200 hover:border-gray-300"
            }`}
          />
          {getFieldError("title") && (
            <p className="text-destructive text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-destructive rounded-full"></span>
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
            Display Order <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="100"
            id="order"
            name="order"
            placeholder="1"
            value={formData.order}
            onChange={(e) => setField("order", e.target.value)}
            required
            disabled={disabled}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 ${
              getFieldError("order")
                ? "border-destructive/30 bg-destructive/10"
                : "border-gray-200 hover:border-gray-300"
            }`}
          />
          {getFieldError("order") && (
            <p className="text-destructive text-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-destructive rounded-full"></span>
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
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="desc"
          name="desc"
          placeholder="Describe your slide content..."
          rows={4}
          value={formData.desc}
          onChange={(e) => setField("desc", e.target.value)}
          required
          disabled={disabled}
          className={`w-full px-4 py-3 border-2 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 ${
            getFieldError("desc")
              ? "border-destructive/30 bg-destructive/10"
              : "border-gray-200 hover:border-gray-300"
          }`}
        />
        {getFieldError("desc") && (
          <p className="text-destructive text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-destructive rounded-full"></span>
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
          Page Link <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          id="redirectLink"
          name="redirectLink"
          placeholder="/SherlockHolmes/abcBooks/..."
          value={formData.redirectLink}
          onChange={(e) => setField("redirectLink", e.target.value)}
          required
          disabled={disabled}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 ${
            getFieldError("redirectLink")
              ? "border-destructive/30 bg-destructive/10"
              : "border-gray-200 hover:border-gray-300"
          }`}
        />
        {getFieldError("redirectLink") && (
          <p className="text-destructive text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-destructive rounded-full"></span>
            {getFieldError("redirectLink")}
          </p>
        )}
      </div>
    </div>
  );
}
