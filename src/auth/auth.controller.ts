import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/cashAsync";
import { authService } from "./auth.servic";
import { sendResponse } from "../utils/sendResponse";
import httpStatus from "http-status"

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await authService.userRegisterIntoDB(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data:  user 

    })

})

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const payload = req.body;

    const { accessToken, refreshToken} = await authService.loginUserIntoDB(payload)

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: " User logged in successfully",
        data: { accessToken, refreshToken }
    })

})

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
        throw new Error("Unauthorized! User ID not found in request.");
    }
    
    const profile = await authService.getMyProfileIntoDB(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: " User profile retirved successfully",
        data: profile
    })
})
export const authController={
    registerUser,
    loginUser,
    getMyProfile
}