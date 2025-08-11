// src/schemas/registerSchema.ts
import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    ConfirmPassword: z.string(),
  })
  .refine((data) => data.password === data.ConfirmPassword, {
    message: "Passwords do not match",
    path: ["ConfirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
