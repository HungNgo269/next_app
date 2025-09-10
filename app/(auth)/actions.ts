"use server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { sql } from "@/lib/db";
import registerSchema from "@/app/schema/registerSchema";
import { signIn } from "@/auth";
import { ActionResult } from "@/app/interface/actionResult";

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

function validateAge(dateOfBirth: Date): boolean {
  const currentDate = new Date();
  const minAge = 0;
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

async function validateBusinessRules(data: any): Promise<void> {
  const errors: string[] = [];

  if (await checkEmailExists(data.email)) {
    errors.push("Email already exists");
  }

  if (await checkUserNameExists(data.userName)) {
    errors.push("Username already exists");
  }

  if (!validateAge(data.dateOfBirth)) {
    errors.push("You must be between 0 and 150 years old");
  }

  if (!validateUserNameContent(data.userName)) {
    errors.push("Username contains forbidden words");
  }

  if (data.dateOfBirth > new Date()) {
    errors.push("Date of birth cannot be in the future");
  }

  if (errors.length > 0) {
    errors.push("Unknow Error");
  }
}

export async function registerUserAction(
  prevState: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      id: crypto.randomUUID(),
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      userName: formData.get("userName") as string,
      passWord: formData.get("passWord") as string,
      dateOfBirth: new Date(formData.get("dateOfBirth") as string),
    };

    console.log("Raw data:", rawData);

    let validatedData;
    try {
      validatedData = registerSchema.parse(rawData);
    } catch (zodError) {
      console.log("Zod validation failed:", zodError);
      throw zodError;
    }

    try {
      await validateBusinessRules(validatedData);
    } catch (businessError) {
      console.log("Business validation failed:", businessError);
      throw businessError;
    }

    const cleanedData = {
      id: validatedData.id,
      email: validatedData.email.trim().toLowerCase(),
      name: validatedData.name.trim(),
      userName: validatedData.userName.trim(),
      passWord: validatedData.passWord,
      dateOfBirth: validatedData.dateOfBirth,
    };

    console.log("Cleaned data:", cleanedData);

    const hashedPassword = await bcrypt.hash(cleanedData.passWord, 10);

    const result = await sql`
      INSERT INTO users (id, email, name, user_name, password, date_of_birth)
      VALUES (${cleanedData.id}, ${cleanedData.email}, ${cleanedData.name}, ${cleanedData.userName}, ${hashedPassword}, ${cleanedData.dateOfBirth})
      RETURNING id, email, name, user_name, date_of_birth
    `;

    console.log("User created:", result);

    const loginResult = await signIn("credentials", {
      email: cleanedData.email,
      password: cleanedData.passWord,
      redirect: false,
    });

    if (loginResult?.error) {
      console.log("Login failed after registration:", loginResult.error);
      return {
        success: false,
        message:
          "Registration successful but auto-login failed. Please login manually.",
      };
    }

    console.log("Login successful, redirecting...");

    return {
      success: true,
      message: "Registration successful! Redirecting...",
      redirectTo: "/dashboard",
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      const errorMessages: string[] = [];

      error.errors.forEach((err) => {
        const fieldName = err.path.join(".");
        const message = err.message;

        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = [];
        }
        fieldErrors[fieldName].push(message);
        errorMessages.push(`${fieldName}: ${message}`);
      });

      return {
        success: false,
        message: `Validation failed: ${errorMessages.join(", ")}`,
        errors: fieldErrors,
      };
    }

    if (error instanceof Error && error.message.includes("duplicate key")) {
      if (error.message.includes("email")) {
        return {
          success: false,
          message:
            "This email is already registered. Please use a different email.",
        };
      }
      if (error.message.includes("user_name")) {
        return {
          success: false,
          message:
            "This username is already taken. Please choose a different username.",
        };
      }
    }

    // Business validation errors
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
