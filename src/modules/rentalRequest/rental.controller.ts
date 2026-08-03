import { Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/cashAsync";
import { rentalService } from "./rental.service";
import { createRentalRequestSchema, updateRentalStatusSchema } from "./rental.validation";


const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const validatedBody = createRentalRequestSchema.parse(req.body);

  const result = await rentalService.createRentalRequestIntoDB(user, validatedBody);
  

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental request submitted successfully",
    data: result,
  });
});

const getMyRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await rentalService.getMyRentalRequestsFromDB(user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

const getRentalRequestById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const result = await rentalService.getRentalRequestByIdFromDB(id as string, user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request details retrieved successfully",
    data: result,
  });
});

const getLandlordRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await rentalService.getLandlordRentalRequestsFromDB(user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Landlord rental requests retrieved successfully",
    data: result,
  });
});

const updateRentalRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;
  const validatedBody = updateRentalStatusSchema.parse(req.body);

  const result = await rentalService.updateRentalRequestStatusIntoDB(id as string, user.id, validatedBody);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Rental request status ${req.body.status}`,
    data: result,
  });
});

export const rentalController = {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestById,
  getLandlordRentalRequests,
  updateRentalRequestStatus,
};