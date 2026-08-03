import { Router } from "express";
import { paymentController } from "./payment.controller";
import { UserRole } from "../../../generated/prisma/enums"; 
import { auth } from "../../middleware/auth";

const router = Router();


router.post("/checkout", auth(UserRole.TENANT), paymentController.createPayment);


router.post("/confirm", paymentController.confirmPayment);


router.get("/", auth(UserRole.TENANT), paymentController.getMyPayments);


router.get("/:id", auth(UserRole.TENANT, UserRole.ADMIN), paymentController.getPaymentById);

export const paymentRoutes = router;