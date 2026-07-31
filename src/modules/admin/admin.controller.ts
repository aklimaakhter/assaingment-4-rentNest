import { Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";
import { catchAsync } from "../../utils/cashAsync";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.updateUserStatusInDB(id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `User status updated to ${req.body.status}`,
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllPropertiesForAdminFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully for admin",
    data: result,
  });
});

const getAllRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllRentalsForAdminFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All rental requests retrieved successfully",
    data: result,
  });
});

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentals,
};