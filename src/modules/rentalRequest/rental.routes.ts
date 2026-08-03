import { Router } from "express";
import { rentalController } from "./rental.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();


router.post(
  "/",
  auth(UserRole.TENANT),
  rentalController.createRentalRequest
);

router.get(
  "/",
  auth(UserRole.TENANT),
  rentalController.getMyRentalRequests
);

router.get(
  "/:id",
  auth(UserRole.TENANT, UserRole.LANDLORD),
  rentalController.getRentalRequestById
);


router.get(
  "/landlord/requests",
  auth(UserRole.LANDLORD),
  rentalController.getLandlordRentalRequests
);

router.patch(
  "/landlord/requests/:id",
  auth(UserRole.LANDLORD),
  rentalController.updateRentalRequestStatus
);

export const rentalRoutes = router;