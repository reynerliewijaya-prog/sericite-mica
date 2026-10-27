import { z } from "zod";
export const mediaUrl = z
  .string()
  .max(1500)
  .refine(
    (v) =>
      v === "" ||
      (() => {
        try {
          const u = new URL(v);
          return u.protocol === "https:" && !u.username && !u.password;
        } catch {
          return false;
        }
      })(),
  );
export const contentSchema = z.object({
  page: z.enum([
    "index",
    "profil",
    "katalog",
    "surface",
    "produk",
    "beranda-mobile",
    "katalog-mobile",
  ]),
  title: z.string().trim().min(1).max(300),
  description: z.string().trim().max(2000),
  image: mediaUrl.optional(),
  gallery: z
    .array(mediaUrl.refine((v) => v !== ""))
    .max(12)
    .optional(),
  publish: z.boolean(),
});
