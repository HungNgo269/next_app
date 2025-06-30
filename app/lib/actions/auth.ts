// app/lib/actions/auth.ts
"use server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { sql } from "@/app/lib/db";
import registerSchema from "@/app/lib/validation/registerSchema";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

// Server Action Result Type
type ActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// Business Logic Error
class BusinessLogicError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BusinessLogicError";
  }
}

// Kiểm tra email đã tồn tại
async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM users WHERE LOWER(email) = LOWER(${email})
    `;
    return Number(result[0].count) > 0;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw new Error("Database error while checking email");
  }
}

// Kiểm tra username đã tồn tại
async function checkUserNameExists(userName: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM users WHERE LOWER(user_name) = LOWER(${userName})
    `;
    return Number(result[0].count) > 0;
  } catch (error) {
    console.error("Error checking username existence:", error);
    throw new Error("Database error while checking username");
  }
}

// Kiểm tra tuổi hợp lệ
function validateAge(dateOfBirth: Date): boolean {
  const currentDate = new Date();
  const minAge = 13;
  const maxAge = 120;

  const age = currentDate.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = currentDate.getMonth() - dateOfBirth.getMonth();
  const dayDiff = currentDate.getDate() - dateOfBirth.getDate();

  let actualAge = age;
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    actualAge--;
  }

  return (
    actualAge >= minAge && actualAge <= maxAge && dateOfBirth <= currentDate
  );
}

// Kiểm tra username content
function validateUserNameContent(userName: string): boolean {
  const forbiddenWords = [
    "admin",
    "root",
    "administrator",
    "moderator",
    "system",
  ];
  const lowerUserName = userName.toLowerCase();
  return !forbiddenWords.some((word) => lowerUserName.includes(word));
}

// Business validation
async function validateBusinessRules(data: any): Promise<void> {
  const errors: string[] = [];

  if (await checkEmailExists(data.email)) {
    errors.push("Email already exists");
  }

  if (await checkUserNameExists(data.userName)) {
    errors.push("Username already exists");
  }

  if (!validateAge(data.dateOfBirth)) {
    errors.push("You must be between 13 and 120 years old");
  }

  if (!validateUserNameContent(data.userName)) {
    errors.push("Username contains forbidden words");
  }

  if (data.dateOfBirth > new Date()) {
    errors.push("Date of birth cannot be in the future");
  }

  if (errors.length > 0) {
    throw new BusinessLogicError(errors.join(", "));
  }
}

export async function registerUserAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  let shouldRedirect = false;

  try {
    // Extract data từ FormData
    const rawData = {
      id: crypto.randomUUID(), // Generate ID
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      userName: formData.get("userName") as string,
      passWord: formData.get("passWord") as string,
      dateOfBirth: new Date(formData.get("dateOfBirth") as string),
    };

    // Zod validation
    const validatedData = registerSchema.parse(rawData);

    // Business logic validation
    await validateBusinessRules(validatedData);

    // Clean data
    const cleanedData = {
      id: validatedData.id,
      email: validatedData.email.trim().toLowerCase(),
      name: validatedData.name,
      userName: validatedData.userName.trim(),
      passWord: validatedData.passWord,
      dateOfBirth: validatedData.dateOfBirth,
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(cleanedData.passWord, 10);

    // Insert vào database
    const result = await sql`
      INSERT INTO users (id, email,name, user_name, password, date_of_birth)
      VALUES (${cleanedData.id}, ${cleanedData.email}, ${cleanedData.name}, ${cleanedData.userName}, ${hashedPassword}, ${cleanedData.dateOfBirth})
      RETURNING id, email,name, user_name, date_of_birth
    `;

    console.log("User registered successfully:", result[0]);
    const loginResult = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("passWord") as string,
      redirect: false,
    });
    shouldRedirect = true;
    if (loginResult?.error) {
      return {
        success: false,
        message:
          "Registration successful but login failed. Please login manually.",
      };
    }
  } catch (error) {
    // Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};

      error.errors.forEach((err) => {
        const fieldName = err.path.join(".");
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = [];
        }
        fieldErrors[fieldName].push(err.message);
      });

      return {
        success: false,
        message: "Validation failed",
        errors: fieldErrors,
      };
    }

    // Business logic errors
    if (error instanceof BusinessLogicError) {
      return {
        success: false,
        message: error.message,
      };
    }

    // Database errors
    console.error("Registration error:", error);

    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes("duplicate key")) {
      if (error.message.includes("email")) {
        return {
          success: false,
          message: "Email already exists",
        };
      }
      if (error.message.includes("user_name")) {
        return {
          success: false,
          message: "Username already exists",
        };
      }
    }

    return {
      success: false,
      message: "An error occurred during registration. Please try again.",
    };
  }

  if (shouldRedirect) {
    redirect("/dashboard");
  }
  return {} as never;
}
