import z from "zod";

export const profileSchema = z.object({
  name: z
    .string({ message: "Please enter a valid name" })
    .min(6, { message: "A valid name should be at least 6 characters" })
    .max(128, {
      message: "A valid user name should be at most 128 characters",
    })
    .regex(/^[a-zA-Z ]+$/, {
      message: "Name can only contain letters (a-z, A-Z), spaces",
    }),
  phone: z
    .string()
    .trim()
    .max(12, "Phone number is too long")
    .regex(/^[0-9+()\-\s]*$/, "Invalid phone number")
    .optional(),
  address: z.string().trim().max(255, "Address is too long").optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
