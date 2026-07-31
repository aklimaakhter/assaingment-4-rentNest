import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums"; 
import { propertyController } from "./properties.controller";

const router = Router();



router.post(
  "/landlord/properties",
  auth(UserRole.LANDLORD),
  propertyController.createProperty
);



router.get("/properties", propertyController.getAllProperties);
router.get("/properties/:id", propertyController.getPropertyById);




router.put(
  "/landlord/properties/:id",
  auth(UserRole.LANDLORD),
  propertyController.updateProperty
);

router.delete(
  "/landlord/properties/:id",
  auth(UserRole.LANDLORD),
  propertyController.deleteProperty
);

export const propertyRoutes = router;