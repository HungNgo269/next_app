import z from "zod";

export const BookSchema = z.object({
  name: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  author: z.string(),
  desc: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});
export const PatchBookSchema = BookSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "At least one field must be provided to update" }
);
