import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();


router.get(
  "/admin/users",
  auth(UserRole.ADMIN),
  adminController.getAllUsers
);

router.patch(
  "/admin/users/:id",
  auth(UserRole.ADMIN),
  adminController.updateUserStatus
);

router.get(
  "/admin/properties",
  auth(UserRole.ADMIN),
  adminController.getAllProperties
);

router.get(
  "/admin/rentals",
  auth(UserRole.ADMIN),
  adminController.getAllRentals
);

export const adminRoutes = router;