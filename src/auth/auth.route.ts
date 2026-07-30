import { Router } from "express";
import { authController } from "./auth.controller";


const router = Router();


router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/login-test", (req, res) => {
    res.send("Login route is working fine!");
});

export const authRoutes = router;