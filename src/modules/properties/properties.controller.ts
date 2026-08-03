import { Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/cashAsync";
import { propertyService } from "./properties.service";
import { createPropertySchema, updatePropertySchema } from "./property.validation";


const createProperty = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req.user?.id as string;
  const validatedBody = createPropertySchema.parse(req.body);

  const result = await propertyService.createPropertyIntoDB( landlordId,validatedBody);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property created successfully",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await propertyService.getAllPropertiesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result,
  });
});

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await propertyService.getPropertyByIdFromDB(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property details retrieved successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const landlordId = req.user?.id as string;
  const validatedBody = updatePropertySchema.parse(req.body);

  const result = await propertyService.updatePropertyIntoDB(id as string,landlordId, validatedBody);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property updated successfully",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const landlordId = (req as any).user?.id as string;
   await propertyService.deletePropertyFromDB(id as string, landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property deleted successfully",
    data: null
  });
});

export const propertyController = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};