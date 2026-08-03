import { z } from "zod";

export const createRentalRequestSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
});

export const updateRentalStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"], {
    message: "Status must be PENDING, APPROVED, or REJECTED",
  }),
});