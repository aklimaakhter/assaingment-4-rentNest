import { Request, Response } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";
import { catchAsync } from "../../utils/cashAsync";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await reviewService.createReviewIntoDB(user.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review submitted successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
};