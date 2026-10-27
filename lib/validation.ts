import { z } from "zod";
export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  company: z.string().trim().max(160),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal(true),
  token: z.string().min(1).max(4096),
  website: z.string().max(0),
});
export const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  series: z.string().trim().min(1).max(80),
  description: z.string().trim().min(10).max(4000),
  published: z.boolean(),
});
