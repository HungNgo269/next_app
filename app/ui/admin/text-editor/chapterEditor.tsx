"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
const DynamicQuill = dynamic(() => import("react-quill-new"), { ssr: false });
interface ChapterEditorProps {
  initialContent?: string;
  onChange?: (value: string) => void;
}
export default function EditComponent({
  initialContent = "",
  onChange,
}: ChapterEditorProps) {
  const [value, setValue] = useState(initialContent);

  useEffect(() => {
    setValue(initialContent);
  }, [initialContent]);

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <DynamicQuill
      defaultValue={value}
      theme="snow"
      value={value}
      onChange={handleChange}
    />
  );
}
