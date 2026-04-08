import { z } from "zod";
import { CURRENCIES } from "@/lib/constants/currencies";

export const listingSchema = z.object({
  title: z.string().trim().min(2, "tooShort").max(120, "tooLong"),
  fruit_type: z.string().trim().min(1, "required"),
  price: z.coerce.number().min(0, "invalidPrice"),
  currency: z.enum(CURRENCIES).default("JPY"),
  description: z.string().trim().max(2000, "tooLong").optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "invalidStock").default(1),
  prefecture: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["draft", "active", "sold", "removed"]).default("draft"),
  images: z
    .array(z.string().url())
    .max(5, "tooLong")
    .optional()
    .default([]),
});

export type ListingInput = z.infer<typeof listingSchema>;
