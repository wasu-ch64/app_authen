import { z } from "zod";

export const editUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().optional(),
    email: z.string().email("Invalid email address"),
});

export type EditUserInput = z.infer<typeof editUserSchema>;
