import { z } from "zod";

export const profileSchema = z.object({
  display_name: z.string().trim().min(1, "required").max(60, "tooLong"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]*$/, "invalidUsername")
    .max(40, "tooLong")
    .optional()
    .or(z.literal("")),
  bio: z.string().trim().max(500, "tooLong").optional().or(z.literal("")),
  preferred_language: z.enum(["ja", "en"]).default("ja"),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
