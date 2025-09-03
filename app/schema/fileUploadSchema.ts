import { z } from "zod";

export const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "File size must be less than 5MB"
  )
  .refine(
    (file) => file.type.startsWith("image/"),
    "Please select an image file (JPG, PNG, GIF)"
  );
