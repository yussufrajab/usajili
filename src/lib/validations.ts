import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+()-\s]+$/, "Invalid phone number format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  institution: z.string().min(1, "Institution is required"),
});

export type RegistrationData = z.infer<typeof registrationSchema>;