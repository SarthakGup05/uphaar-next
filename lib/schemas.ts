import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(15, { message: "Title must be at least 15 characters long" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase alphanumeric with hyphens",
  }),
  description: z
    .string()
    .min(200, { message: "Description must be at least 200 characters long" })
    .max(2000, { message: "Description cannot exceed 2000 characters" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  stock: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Stock must be a non-negative integer" }),
  category: z.enum(["Resin", "Candles", "Concrete Decor", "Gift Hampers"], {
    message: "Please select a valid category",
  }),
  imageUrl: z.string().url({ message: "Product image is required" }),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  images: z.array(z.string().url()).optional(),
});

export const heroSlideSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(60, { message: "Title cannot exceed 60 characters" }),
  subtitle: z
    .string()
    .max(160, { message: "Subtitle cannot exceed 160 characters" })
    .optional(),
  image: z.string().url({ message: "Image is required" }),
  cta: z
    .string()
    .min(1, { message: "Button text is required" })
    .max(30, { message: "Button text cannot exceed 30 characters" }),
  link: z.string().default("/shop"),
  align: z.enum(["left", "center", "right"]).default("left"),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type HeroSlideFormValues = z.infer<typeof heroSlideSchema>;

export const workshopSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase alphanumeric with hyphens",
  }),
  description: z
    .string()
    .min(50, { message: "Description must be at least 50 characters long" }),
  date: z.coerce.date(),
  location: z.string().min(1, { message: "Location is required" }),
  price: z.coerce
    .number()
    .nonnegative({ message: "Price must be a non-negative number" }),
  totalSeats: z.coerce
    .number()
    .int()
    .positive({ message: "Total seats must be a positive integer" }),
  image: z.string().url({ message: "Main image is required" }),
  images: z.array(z.string().url()).optional(),
  instructor: z.string().optional(),
});

export type WorkshopFormValues = z.infer<typeof workshopSchema>;
