import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Please enter email or username"),
  password: z.string().min(6, "password is requied"),
});

export type LoginSchema = typeof loginSchema._type;
