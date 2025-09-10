"use client";

import GenericDeleteButton from "@/app/ui/admin/button/deleteButton";
import { DeleteSlideActions } from "@/app/actions/slideActions";
interface SlideDeleteButtonProps {
  id: string;
}

export default function SlideDeleteButton({ id }: SlideDeleteButtonProps) {
  return (
    <GenericDeleteButton
      id={id}
      onDelete={() => DeleteSlideActions(id, "/dashboard/slides")}
      key={id}
      confirmMessage="Are you sure you want to delete this slide?"
      successMessage="Delete slide success"
    ></GenericDeleteButton>
  );
}
