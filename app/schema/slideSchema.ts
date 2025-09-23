import z from "zod";

export const SlideSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  display_order: z
    .string()
    .min(1, "Order is required")
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0;
    }, "Order must be a positive number"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  redirect_url: z
    .string()
    .min(1, "Page link is required")
    .refine((val) => {
      return val.startsWith("/") || val.startsWith("http");
    }, "Link must start with '/' or 'http'"),
  is_active: z.boolean(),
});
export const PatchSlideSchema = SlideSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "At least one field must be provided to update" }
);
