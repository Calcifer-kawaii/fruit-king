import { z } from "zod";

export const inquirySchema = z.object({
  subject: z.string().trim().max(120, "tooLong").optional().or(z.literal("")),
  message: z.string().trim().min(1, "required").max(2000, "tooLong"),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
