import { z } from "zod";

const registerSchema = z.object({
  id: z.string(),
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  name: z
    .string({ message: "Please enter a valid name" })
    .min(6, { message: "A valid name should be at least 6 characters" })
    .max(128, {
      message: "A valid user name should be at most 128 characters",
    })
    .regex(/^[a-zA-Z ,]+$/, {
      message: "Name can only contain letters (a-z, A-Z), spaces, and commas",
    }),
  userName: z
    .string({
      message: "Please enter a valid user name",
    })
    .min(6, { message: "A valid user name should be at least 6 characters" })
    .max(32, { message: "A valid user name should be at most 32 characters" }),
  passWord: z
    .string()
    .min(6, { message: "A valid pass word should be at least 6 characters" })
    .max(32, { message: "A valid pass word should be at most 32 characters" }),
  dateOfBirth: z.coerce.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Invalid date format",
  }),
});

export default registerSchema;
