import z from "zod";

export const ChapterSchema = z.object({
  book_id: z
    .number({ invalid_type_error: "Book id must be a number" })
    .int("Book id must be an integer")
    .positive("Book id must be positive"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title must be less than 150 characters"),
  chapter_number: z
    .number({ invalid_type_error: "Chapter number must be a number" })
    .int("Chapter number must be an integer")
    .nonnegative("Chapter number must be non-negative"),
  content: z.string().min(1, "Content is required"),
});

export const PatchChapterSchema = ChapterSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "At least one field must be provided to update" }
);
