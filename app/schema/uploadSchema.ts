import z from "zod";

export const uploadSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  order: z
    .string()
    .min(1, "Order is required")
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0;
    }, "Order must be a positive number"),
  desc: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  redirectLink: z
    .string()
    .min(1, "Page link is required")
    .refine((val) => {
      return val.startsWith("/") || val.startsWith("http");
    }, "Link must start with '/' or 'http'"),
});
