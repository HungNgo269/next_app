"use client";

import { usePathname } from "next/navigation";
import GenericDeleteButton from "@/app/ui/admin/button/deleteButton";
import { DeleteSlideActions } from "@/app/actions/slideActions";
interface SlideDeleteButtonProps {
  id: string;
}

export default function SlideDeleteButton({ id }: SlideDeleteButtonProps) {
  const currentPath = usePathname();
  return (
    <GenericDeleteButton
      id={id}
      onDelete={() => DeleteSlideActions(id, currentPath)}
      key={id}
      confirmMessage="Are you sure you want to delete this slide?"
      successMessage="Delete slide success"
    ></GenericDeleteButton>
  );
}
