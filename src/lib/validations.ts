import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(2, "Jina lazima liwe na herufi 2 au zaidi"),
  username: z
    .string()
    .min(3, "Jina la mtumiaji lazima liwe na herufi 3 au zaidi")
    .regex(/^[a-zA-Z0-9_]+$/, "Jina la mtumiaji liwe na herufi, namba na _ tu"),
  email: z
    .string()
    .email("Barua pepe si sahihi")
    .regex(/\.go\.tz$/, "Barua pepe lazima iishe na .go.tz"),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Nambari ya simu lazima iwe tarakimu 10 zikianza na 0"),
  password: z
    .string()
    .min(8, "Nenosiri lazima liwe na herufi 8 au zaidi")
    .regex(/[0-9]/, "Nenosiri lazima liwe na namba angalau moja")
    .regex(/[^a-zA-Z0-9]/, "Nenosiri lazima liwe na alama maalum angalau moja"),
  institution: z.string().min(1, "Taasisi inahitajika"),
});

export type RegistrationData = z.infer<typeof registrationSchema>;