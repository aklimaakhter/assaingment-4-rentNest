import { z } from "zod";

export const createPaymentSchema = z.object({
  rentalRequestId: z.string().min(1, "Rental Request ID is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  provider: z.enum(["STRIPE", "SSLCOMMERZ"], {
    message: "Provider must be STRIPE or SSLCOMMERZ",
  }),
});