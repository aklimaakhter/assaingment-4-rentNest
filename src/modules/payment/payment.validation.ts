import { z } from "zod";

export const createPaymentSchema = z.object({
  rentalRequestId: z.string().min(1, "Rental Request ID is required"),
});