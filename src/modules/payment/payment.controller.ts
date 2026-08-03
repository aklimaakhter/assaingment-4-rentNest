import { Request, Response } from "express";
import httpStatus from "http-status"
import { paymentService } from "./payment.service";
import { catchAsync } from "../../utils/cashAsync";
import { sendResponse } from "../../utils/sendResponse";

const createPayment = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { rentalRequestId } = req.body;

    const result = await paymentService.createPaymentSessionIntoDB(user.id, rentalRequestId);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Payment session created successfully",
        data: result
    })

});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
    const { sessionId } = req.body;

    const result = await paymentService.confirmPaymentInDB(sessionId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment confirmed successfully",
        data: result
    })

});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;

    const result = await paymentService.getMyPaymentsFromDB(user.id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment history retrieved successfully",
        data: result
    })
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await paymentService.getPaymentByIdFromDB(id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment details retrieved successfully",
        data: result
    })
});

export const paymentController = {
    createPayment,
    confirmPayment,
    getMyPayments,
    getPaymentById,
};