import { z } from "zod";
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
  publish: z.boolean(),
});
