import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  location: z.string().trim().min(1, "Location is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  isAvailable: z.boolean().optional(),
});

export const updatePropertySchema = createPropertySchema.partial();