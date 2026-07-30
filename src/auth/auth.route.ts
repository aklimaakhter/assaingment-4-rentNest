import { Router } from "express";
import { authController } from "./auth.controller";


const router = Router()

router.post("/register", authController.registerUser);

// router.get("/me",
    // (req: Request, res: Response, next: NextFunction) => {
    //     const { accessToken } = req.cookies;

    //     const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);

    //     if (!verifiedToken.success) {
    //         throw new Error(verifiedToken.error)
    //     }

    //     const { id, name, email, role } = verifiedToken.data as JwtPayload;

    //     const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR]
    //     if (!requiredRoles.includes(role)) {
    //         return res.send(403).json({
    //             success: true,
    //             statusCode: httpStatus.FORBIDDEN,
    //             message: "Forbidden, You do not have permission to access this resource"
    //         })
    //     }
    //     req.user = {
    //         id,
    //         name,
    //         email,
    //         role
    //     }
    //     next()

    // },
    // auth(Role.ADMIN, Role.USER, Role.AUTHOR),
    // userController.getMyProfile);

// router.put("/my-profile", auth(Role.ADMIN, Role.AUTHOR, Role.USER), userController.updatedMyProfile);


export const authRoutes = router