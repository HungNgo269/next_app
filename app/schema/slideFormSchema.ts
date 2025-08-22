import { z } from "zod";

export const slideSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),

  desc: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),

  order: z
    .number()
    .min(1, "Order must be at least 1")
    .max(100, "Order must be less than 100"),

  redirectLink: z
    .string()
    .min(1, "Page link is required")
    .startsWith("/", "Page link must start with /"),
});

export type SlideFormData = z.infer<typeof slideSchema>;
