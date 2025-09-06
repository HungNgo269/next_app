import React, { useState, useEffect } from "react";
import { z } from "zod";

interface FormFieldProps {
  label: string;
  id: string;
  name?: string;
  type?: "text" | "number" | "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  min?: number;
  max?: number;
  rows?: number;
  className?: string;
  // Zod validation
  schema?: z.ZodSchema;
  onValidation?: (fieldName: string, error: string | null) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export default function FormField({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  error = "",
  min,
  max,
  rows = 4,
  className = "",
  schema,
  onValidation,
  validateOnChange = false,
  validateOnBlur = true,
}: FormFieldProps) {
  const [localError, setLocalError] = useState<string>("");
  const [isTouched, setIsTouched] = useState(false);

  // Use external error or local error
  const displayError = error || (isTouched ? localError : "");

  const validateValue = (val: string) => {
    if (!schema) return null;

    try {
      // For number type, convert to number for validation
      const valueToValidate =
        type === "number" ? (val ? Number(val) : val) : val;

      // Create a simple object with the field for validation
      const testObj = { [name || id]: valueToValidate };

      // Try to validate just this field
      if (schema instanceof z.ZodObject) {
        const fieldSchema = schema.pick({ [name || id]: true });
        fieldSchema.parse(testObj);
      } else {
        schema.parse(valueToValidate);
      }

      return null;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return validationError.errors[0]?.message || "Invalid value";
      }
      return "Invalid value";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (validateOnChange && isTouched) {
      const validationError = validateValue(newValue);
      setLocalError(validationError || "");
      if (onValidation) {
        onValidation(name || id, validationError);
      }
    }
  };

  const handleBlur = () => {
    setIsTouched(true);

    if (validateOnBlur) {
      const validationError = validateValue(value);
      setLocalError(validationError || "");
      if (onValidation) {
        onValidation(name || id, validationError);
      }
    }
  };

  const handleFocus = () => {
    if (!isTouched) {
      setIsTouched(true);
    }
  };

  // Clear local error when external error changes
  useEffect(() => {
    if (error) {
      setLocalError("");
    }
  }, [error]);

  const inputClassName = `w-full px-4 py-3 border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 rounded-lg ${
    displayError
      ? "border-red-300 bg-red-50"
      : "border-gray-200 hover:border-gray-300 focus:border-primary"
  }`;

  const textareaClassName = `${inputClassName} resize-y`;

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          name={name || id}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          rows={rows}
          required={required}
          disabled={disabled}
          className={textareaClassName}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name || id}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={inputClassName}
        />
      )}

      {displayError && (
        <p className="text-red-600 text-sm flex items-center gap-1 animate-fadeIn">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {displayError}
        </p>
      )}

      {/* Success indicator when field is valid and touched */}
      {isTouched && !displayError && value.trim() && (
        <p className="text-green-600 text-sm flex items-center gap-1 animate-fadeIn">
          <span className="w-1 h-1 bg-green-600 rounded-full"></span>
          Looks good!
        </p>
      )}
    </div>
  );
}
